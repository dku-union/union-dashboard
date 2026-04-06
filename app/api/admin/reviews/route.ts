import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminReviews } from "@/lib/admin/reviews";
import { adminReviewListQuerySchema } from "@/lib/validations";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const parsed = adminReviewListQuerySchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "조회 조건이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const reviews = await listAdminReviews(parsed.data.status, parsed.data.q);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
