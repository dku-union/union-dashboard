import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { MiniAppCategoryDto } from "@/types/app-version";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import { logger } from "@/lib/observability/logger";

// Spring 측은 permitAll 이지만 dashboard 호출은 항상 publisher 세션이 있는
// 흐름에서 일어나므로 인증 체크는 유지. 응답은 클라이언트 5분 캐시로 두어
// 등록 폼이 자주 fetch 해도 부담 없게.
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const result = await springFetch<MiniAppCategoryDto[]>(
      "/mini-apps/categories",
      session,
    );

    if ("error" in result) {
      logger.warn("mini_app.categories.spring_failed", {
        requestId,
        actorId: session.id,
        status: result.status,
      });
      return jsonError(
        result.error,
        result.status,
        requestId,
        "SPRING_REQUEST_FAILED",
      );
    }

    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("mini_app.categories.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
