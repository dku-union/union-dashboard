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
import { z } from "zod";

const ALLOWED_CONTENT_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
const MAX_ICON_BYTES = 2 * 1024 * 1024;

const bodySchema = z.object({
  filename: z
    .string()
    .min(1, "파일명이 비어 있습니다.")
    .max(255, "파일명이 너무 깁니다."),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  contentLength: z
    .number()
    .int()
    .positive()
    .max(MAX_ICON_BYTES, "아이콘은 최대 2MB까지 업로드할 수 있습니다."),
});

// Spring 응답: GcsSignedUrlResponseDto 컨벤션({signedUrl, fileUrl}) 또는
// CreateVersionResponseDto 컨벤션({uploadUrl}) 둘 다 흡수해 클라이언트엔
// {uploadUrl, iconUrl}로 정규화한다.
interface IconUploadUrlSpringResponse {
  uploadUrl?: string;
  signedUrl?: string;
  iconUrl?: string;
  fileUrl?: string;
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
      logger.warn("mini_app.icon.upload_url.denied", {
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
      logger.warn("mini_app.icon.upload_url.denied", {
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

    // Spring 측은 filename 만 사용. contentType/contentLength 는 dashboard 측 검증 용도.
    const result = await springFetch<IconUploadUrlSpringResponse>(
      `/mini-apps/${miniAppId}/icon/upload-url`,
      session,
      {
        method: "POST",
        body: { filename: parsed.data.filename },
      },
    );

    if ("error" in result) {
      logger.warn("mini_app.icon.upload_url.spring_failed", {
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

    const uploadUrl = result.data.uploadUrl ?? result.data.signedUrl;
    const iconUrl = result.data.iconUrl ?? result.data.fileUrl;
    if (!uploadUrl || !iconUrl) {
      logger.error(
        "mini_app.icon.upload_url.bad_response",
        new Error("Spring response missing uploadUrl/iconUrl"),
        { requestId, actorId: session.id, miniAppId },
      );
      return jsonError(
        "백엔드 응답이 올바르지 않습니다.",
        502,
        requestId,
        "SPRING_BAD_RESPONSE",
      );
    }

    logger.info("mini_app.icon.upload_url.issued", {
      requestId,
      actorId: session.id,
      miniAppId,
    });

    return jsonData({ uploadUrl, iconUrl }, requestId);
  } catch (error) {
    return serverError(
      "mini_app.icon.upload_url.failed",
      error,
      requestId,
      undefined,
      { actorId: session.id, miniAppId },
    );
  }
}
