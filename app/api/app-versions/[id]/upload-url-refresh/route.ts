import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { CreateVersionResponse } from "@/types/app-version";
import { canWriteAppVersion, getVersionMembership } from "@/lib/app-versions/access";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const originError = requireSameOrigin(request, requestId);
  if (originError) return originError;

  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;

  try {
    const membership = await getVersionMembership(id, session.id);
    if (!membership) {
      logger.warn("app_version.refresh_url.denied", {
        requestId,
        actorId: session.id,
        versionId: id,
        reason: "NO_MEMBERSHIP",
      });
      return jsonError("버전 접근 권한이 없습니다.", 403, requestId, "VERSION_ACCESS_DENIED");
    }
    if (!canWriteAppVersion(membership.role)) {
      logger.warn("app_version.refresh_url.denied", {
        requestId,
        actorId: session.id,
        versionId: id,
        role: membership.role,
        reason: "INSUFFICIENT_ROLE",
      });
      return jsonError("재발급 권한이 없습니다.", 403, requestId, "VERSION_WRITE_DENIED");
    }

    const result = await springFetch<CreateVersionResponse>(
      `/app-versions/${id}/upload-url-refresh`,
      session,
      { method: "POST" },
    );

    if ("error" in result) {
      logger.warn("app_version.refresh_url.spring_failed", {
        requestId,
        actorId: session.id,
        versionId: id,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    logger.info("app_version.refresh_url.succeeded", {
      requestId,
      actorId: session.id,
      versionId: id,
    });
    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("app_version.refresh_url.failed", error, requestId, undefined, {
      actorId: session.id,
      versionId: id,
    });
  }
}
