import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminReviewDetail } from "@/lib/admin/reviews";

const paramsSchema = z.object({
  id: z.string().uuid("유효하지 않은 버전 ID입니다."),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const parsedParams = paramsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: parsedParams.error.issues[0]?.message ?? "유효하지 않은 ID입니다." }, { status: 400 });
  }

  try {
    const review = await getAdminReviewDetail(parsedParams.data.id);

    if (!review) {
      return NextResponse.json({ error: "심사 대상을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("GET /api/admin/reviews/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
