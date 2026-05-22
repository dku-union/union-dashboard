import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { Review } from "@/types/app-version";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import { logger } from "@/lib/observability/logger";

// 내 심사 목록 조회
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const result = await springFetch<Review[]>("/reviews/mine", session);

    if ("error" in result) {
      logger.warn("review.mine.spring_failed", {
        requestId,
        actorId: session.id,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("review.mine.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
