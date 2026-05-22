import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { AppVersion } from "@/types/app-version";
import { getVersionMembership } from "@/lib/app-versions/access";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import { logger } from "@/lib/observability/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;

  try {
    const membership = await getVersionMembership(id, session.id);
    if (!membership) {
      return jsonError(
        "버전 접근 권한이 없습니다.",
        403,
        requestId,
        "VERSION_ACCESS_DENIED",
      );
    }

    const result = await springFetch<AppVersion>(`/app-versions/${id}`, session);

    if ("error" in result) {
      logger.warn("app_version.get.spring_failed", {
        requestId,
        actorId: session.id,
        versionId: id,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("app_version.get.failed", error, requestId, undefined, {
      actorId: session.id,
      versionId: id,
    });
  }
}
