import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import { canWriteAppVersion, getVersionMembership } from "@/lib/app-versions/access";
import { getRequestId, jsonData, jsonError, serverError } from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";

interface TestSessionResponse {
  testLink: string;
}

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
    if (session.role !== "ROLE_ADMIN") {
      const membership = await getVersionMembership(id, session.id);
      if (!membership) {
        logger.warn("app_version.test_session.denied", { requestId, actorId: session.id, versionId: id });
        return jsonError("버전 접근 권한이 없습니다.", 403, requestId, "VERSION_ACCESS_DENIED");
      }
      if (!canWriteAppVersion(membership.role)) {
        logger.warn("app_version.test_session.denied", {
          requestId,
          actorId: session.id,
          versionId: id,
          role: membership.role,
        });
        return jsonError("테스트 세션 생성 권한이 없습니다.", 403, requestId, "VERSION_WRITE_DENIED");
      }
    }

    const result = await springFetch<TestSessionResponse>(
      `/app-versions/${id}/test-session`,
      session,
      { method: "POST" },
    );

    if ("error" in result) {
      logger.warn("app_version.test_session.spring_failed", {
        requestId,
        actorId: session.id,
        versionId: id,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    logger.info("app_version.test_session.succeeded", {
      requestId,
      actorId: session.id,
      versionId: id,
      actorRole: session.role,
    });
    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("app_version.test_session.failed", error, requestId, undefined, {
      actorId: session.id,
      versionId: id,
    });
  }
}
