import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import { createVersionSchema } from "@/lib/validations";
import type { CreateVersionResponse, AppVersion } from "@/types/app-version";
import { canWriteAppVersion, getMiniAppMembership } from "@/lib/app-versions/access";
import { getRequestId, jsonData, jsonError, serverError } from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";

// 버전 생성 (DRAFT + GCS 업로드 URL 반환)
export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const originError = requireSameOrigin(request, requestId);
  if (originError) return originError;

  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const body = await request.json();
    const parsed = createVersionSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("입력값이 올바르지 않습니다.", 400, requestId, "INVALID_INPUT");
    }

    const membership = await getMiniAppMembership(parsed.data.miniAppId, session.id);
    if (!membership) {
      logger.warn("app_version.create.denied", {
        requestId,
        actorId: session.id,
        miniAppId: parsed.data.miniAppId,
        reason: "NO_MEMBERSHIP",
      });
      return jsonError("앱 접근 권한이 없습니다.", 403, requestId, "APP_ACCESS_DENIED");
    }
    if (!canWriteAppVersion(membership.role)) {
      logger.warn("app_version.create.denied", {
        requestId,
        actorId: session.id,
        miniAppId: parsed.data.miniAppId,
        role: membership.role,
        reason: "INSUFFICIENT_ROLE",
      });
      return jsonError("버전 업로드 권한이 없습니다.", 403, requestId, "VERSION_WRITE_DENIED");
    }

    const result = await springFetch<CreateVersionResponse>("/app-versions", session, {
      method: "POST",
      body: parsed.data,
    });

    if ("error" in result) {
      logger.warn("app_version.create.spring_failed", {
        requestId,
        actorId: session.id,
        miniAppId: parsed.data.miniAppId,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    logger.info("app_version.create.succeeded", {
      requestId,
      actorId: session.id,
      miniAppId: parsed.data.miniAppId,
      versionId: result.data.versionId,
    });

    return jsonData(result.data, requestId, 201);
  } catch (error) {
    return serverError("app_version.create.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}

// 미니앱별 버전 목록
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { searchParams } = new URL(request.url);
  const miniAppId = searchParams.get("miniAppId");
  if (!miniAppId) {
    return jsonError("miniAppId가 필요합니다.", 400, requestId, "MISSING_MINI_APP_ID");
  }

  try {
    const numericMiniAppId = Number(miniAppId);
    if (!Number.isInteger(numericMiniAppId) || numericMiniAppId <= 0) {
      return jsonError("miniAppId가 올바르지 않습니다.", 400, requestId, "INVALID_MINI_APP_ID");
    }

    const membership = await getMiniAppMembership(numericMiniAppId, session.id);
    if (!membership) {
      logger.warn("app_version.list.denied", {
        requestId,
        actorId: session.id,
        miniAppId: numericMiniAppId,
      });
      return jsonError("앱 접근 권한이 없습니다.", 403, requestId, "APP_ACCESS_DENIED");
    }

    const result = await springFetch<AppVersion[]>(
      `/app-versions/mini-app/${miniAppId}`,
      session,
    );

    if ("error" in result) {
      logger.warn("app_version.list.spring_failed", {
        requestId,
        actorId: session.id,
        miniAppId: numericMiniAppId,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("app_version.list.failed", error, requestId, undefined, {
      actorId: session.id,
      miniAppId,
    });
  }
}
