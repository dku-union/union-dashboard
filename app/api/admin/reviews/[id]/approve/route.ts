import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminReviewDecisionTarget } from "@/lib/admin/reviews";
import { db } from "@/lib/db";
import { appVersions, miniApps, reviews } from "@/lib/db/schema";
import type { AdminApproveReviewResponse } from "@/types/admin-review";

const paramsSchema = z.object({
  id: z.string().uuid("유효하지 않은 버전 ID입니다."),
});

export async function POST(
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
    const target = await getAdminReviewDecisionTarget(parsedParams.data.id);

    if (!target) {
      return NextResponse.json({ error: "심사 대상을 찾을 수 없습니다." }, { status: 404 });
    }

    if (target.existingReviewId) {
      return NextResponse.json({ error: "이미 심사 완료된 버전입니다." }, { status: 409 });
    }

    if (target.versionStatus !== "IN_REVIEW") {
      return NextResponse.json({ error: "심사 중 상태의 버전만 승인할 수 있습니다." }, { status: 409 });
    }

    const now = new Date();

    const result = await db.transaction(async (tx) => {
      const [createdReview] = await tx
        .insert(reviews)
        .values({
          versionId: target.versionId,
          reviewerId: auth.session.id,
          verdict: "ACCEPTED",
          reason: null,
          decidedAt: now,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ id: reviews.id });

      await tx
        .update(appVersions)
        .set({
          status: "ACCEPTED",
          updatedAt: now,
        })
        .where(eq(appVersions.id, target.versionId));

      await tx
        .update(miniApps)
        .set({
          status: "APPROVED",
          updatedAt: now,
        })
        .where(eq(miniApps.id, target.miniAppId));

      return createdReview;
    });

    const response: AdminApproveReviewResponse = {
      versionId: target.versionId,
      reviewId: result.id,
      versionStatus: "ACCEPTED",
      miniAppStatus: "APPROVED",
      reviewedAt: now.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /api/admin/reviews/[id]/approve error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
