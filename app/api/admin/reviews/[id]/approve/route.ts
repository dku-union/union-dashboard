import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminReviewDecisionTarget, getAdminReviewDetail } from "@/lib/admin/reviews";
import { springFetch } from "@/lib/spring/client";
import type { Review } from "@/types/app-version";
import { getRequestId, jsonData, jsonError, serverError } from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";

// 심사 승인 (Spring 프록시)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const originError = requireSameOrigin(request, requestId);
  if (originError) return originError;

  const auth = await requireAdminSession();
  if ("error" in auth) {
    return jsonError(auth.error ?? "관리자 권한이 필요합니다.", auth.status, requestId, "ADMIN_AUTH_REQUIRED");
  }

  const { id } = await params;

  try {
    const target = await getAdminReviewDecisionTarget(id);
    if (!target) {
      return jsonError("심사 대상을 찾을 수 없습니다.", 404, requestId, "REVIEW_TARGET_NOT_FOUND");
    }
    if (target.versionStatus !== "IN_REVIEW") {
      logger.warn("admin_review.approve.rejected_state", {
        requestId,
        actorId: auth.session.id,
        versionId: id,
        versionStatus: target.versionStatus,
      });
      return jsonError("심사 중인 버전만 승인할 수 있습니다.", 409, requestId, "INVALID_REVIEW_STATE");
    }

    const result = await springFetch<Review>(`/reviews/versions/${id}/decision`, auth.session, {
      method: "POST",
      body: { verdict: "ACCEPTED" },
    });

    if ("error" in result) {
      logger.warn("admin_review.approve.spring_failed", {
        requestId,
        actorId: auth.session.id,
        versionId: id,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    const review = await getAdminReviewDetail(id);
    if (!review) {
      return jsonError("변경된 심사 정보를 찾을 수 없습니다.", 404, requestId, "UPDATED_REVIEW_NOT_FOUND");
    }

    logger.info("admin_review.approve.succeeded", {
      requestId,
      actorId: auth.session.id,
      versionId: id,
      reviewId: review.reviewId,
    });

    return jsonData({ review }, requestId);
  } catch (error) {
    return serverError("admin_review.approve.failed", error, requestId, undefined, {
      actorId: auth.session.id,
      versionId: id,
    });
  }
}
