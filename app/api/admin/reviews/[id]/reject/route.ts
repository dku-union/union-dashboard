import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminReviewDecisionTarget, getAdminReviewDetail } from "@/lib/admin/reviews";
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
    const target = await getAdminReviewDecisionTarget(id);
    if (!target) {
      return NextResponse.json({ error: "Review target not found." }, { status: 404 });
    }
    if (target.versionStatus !== "IN_REVIEW") {
      return NextResponse.json({ error: "Only IN_REVIEW versions can be rejected." }, { status: 409 });
    }
    if (!target.existingReviewId) {
      return NextResponse.json({ error: "Pending review not found." }, { status: 409 });
    }

    const body = await request.json();
    const parsed = adminRejectReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const result = await springFetch<Review>(`/reviews/${target.existingReviewId}/decision`, auth.session, {
      method: "POST",
      body: { verdict: "REJECTED", reason: parsed.data.reason },
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const review = await getAdminReviewDetail(id);
    if (!review) {
      return NextResponse.json({ error: "Updated review not found." }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("POST /api/admin/reviews/[id]/reject error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
