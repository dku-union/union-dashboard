import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { Review, SubmitReviewRequest } from "@/types/app-version";
import { canWriteAppVersion, getVersionMembership } from "@/lib/app-versions/access";
import { getRequestId, jsonData, jsonError, serverError } from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";

// 심사 요청 제출
export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const originError = requireSameOrigin(request, requestId);
  if (originError) return originError;

  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const body: SubmitReviewRequest = await request.json();
    if (!body.versionId) {
      return jsonError("versionId가 필요합니다.", 400, requestId, "MISSING_VERSION_ID");
    }

    const membership = await getVersionMembership(body.versionId, session.id);
    if (!membership) {
      logger.warn("review.submit.denied", {
        requestId,
        actorId: session.id,
        versionId: body.versionId,
        reason: "NO_MEMBERSHIP",
      });
      return jsonError("버전 접근 권한이 없습니다.", 403, requestId, "VERSION_ACCESS_DENIED");
    }
    if (!canWriteAppVersion(membership.role)) {
      logger.warn("review.submit.denied", {
        requestId,
        actorId: session.id,
        versionId: body.versionId,
        role: membership.role,
        reason: "INSUFFICIENT_ROLE",
      });
      return jsonError("심사 요청 권한이 없습니다.", 403, requestId, "REVIEW_SUBMIT_DENIED");
    }

    const result = await springFetch<Review>("/reviews", session, {
      method: "POST",
      body: { versionId: body.versionId },
    });

    if ("error" in result) {
      logger.warn("review.submit.spring_failed", {
        requestId,
        actorId: session.id,
        versionId: body.versionId,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    logger.info("review.submit.succeeded", {
      requestId,
      actorId: session.id,
      versionId: body.versionId,
      reviewId: result.data.id,
    });

    return jsonData(result.data, requestId, 201);
  } catch (error) {
    return serverError("review.submit.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
