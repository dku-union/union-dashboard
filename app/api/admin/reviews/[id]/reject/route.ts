import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { springFetch } from "@/lib/spring/client";
import { adminRejectReviewSchema } from "@/lib/validations";
import type { Review } from "@/types/app-version";

// 심사 반려 (Spring 프록시)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = adminRejectReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const result = await springFetch<Review>(`/reviews/${id}/decision`, auth.session, {
      method: "POST",
      body: { verdict: "REJECTED", reason: parsed.data.reason },
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("POST /api/admin/reviews/[id]/reject error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
