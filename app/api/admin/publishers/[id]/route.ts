import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminPublisherDetail } from "@/lib/admin/publishers";

const paramsSchema = z.object({
  id: z.string().uuid("유효하지 않은 퍼블리셔 ID입니다."),
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
    const publisher = await getAdminPublisherDetail(parsedParams.data.id);
    if (!publisher) {
      return NextResponse.json({ error: "퍼블리셔를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ publisher });
  } catch (error) {
    console.error("GET /api/admin/publishers/[id] error:", error);
    return NextResponse.json({ error: "퍼블리셔 상세를 불러오지 못했습니다." }, { status: 500 });
  }
}

