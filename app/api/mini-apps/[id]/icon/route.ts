import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { miniApps } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import {
  canWriteAppVersion,
  getMiniAppMembership,
} from "@/lib/app-versions/access";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";

const bodySchema = z.object({
  iconUrl: z
    .string()
    .url("유효한 URL이 아닙니다.")
    .max(500, "iconUrl이 너무 깁니다."),
});

// Spring 응답: {iconUrl} 또는 {fileUrl} 또는 MiniApp 전체 DTO 가능성 모두 흡수.
interface IconUpdateSpringResponse {
  iconUrl?: string;
  fileUrl?: string;
}

export async function PATCH(
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
  const miniAppId = Number(id);
  if (!Number.isInteger(miniAppId) || miniAppId <= 0) {
    return jsonError("유효하지 않은 ID입니다.", 400, requestId, "INVALID_ID");
  }

  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        400,
        requestId,
        "INVALID_INPUT",
      );
    }

    const membership = await getMiniAppMembership(miniAppId, session.id);
    if (!membership) {
      logger.warn("mini_app.icon.update.denied", {
        requestId,
        actorId: session.id,
        miniAppId,
        reason: "NO_MEMBERSHIP",
      });
      return jsonError(
        "앱 접근 권한이 없습니다.",
        403,
        requestId,
        "APP_ACCESS_DENIED",
      );
    }
    if (!canWriteAppVersion(membership.role)) {
      logger.warn("mini_app.icon.update.denied", {
        requestId,
        actorId: session.id,
        miniAppId,
        role: membership.role,
        reason: "INSUFFICIENT_ROLE",
      });
      return jsonError(
        "아이콘 변경 권한이 없습니다.",
        403,
        requestId,
        "ICON_WRITE_DENIED",
      );
    }

    const result = await springFetch<IconUpdateSpringResponse>(
      `/mini-apps/${miniAppId}/icon`,
      session,
      {
        method: "PATCH",
        body: parsed.data,
      },
    );

    if ("error" in result) {
      logger.warn("mini_app.icon.update.spring_failed", {
        requestId,
        actorId: session.id,
        miniAppId,
        status: result.status,
      });
      return jsonError(
        result.error,
        result.status,
        requestId,
        "SPRING_REQUEST_FAILED",
      );
    }

    const savedIconUrl =
      result.data?.iconUrl ?? result.data?.fileUrl ?? parsed.data.iconUrl;

    await db
      .update(miniApps)
      .set({ iconUrl: savedIconUrl, updatedAt: new Date() })
      .where(eq(miniApps.id, miniAppId));

    logger.info("mini_app.icon.update.succeeded", {
      requestId,
      actorId: session.id,
      miniAppId,
    });

    return jsonData({ iconUrl: savedIconUrl }, requestId);
  } catch (error) {
    return serverError(
      "mini_app.icon.update.failed",
      error,
      requestId,
      undefined,
      { actorId: session.id, miniAppId },
    );
  }
}
