import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { updateAdminMiniAppStatus } from "@/lib/admin/mini-apps";
import { adminMiniAppStatusSchema } from "@/lib/validations";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive("유효하지 않은 미니앱 ID입니다."),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return jsonError(auth.error, auth.status, requestId, "ADMIN_AUTH_FAILED");
  }

  const parsedParams = paramsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return jsonError(
      parsedParams.error.issues[0]?.message ?? "유효하지 않은 ID입니다.",
      400,
      requestId,
      "INVALID_PARAMS",
    );
  }

  const parsedBody = adminMiniAppStatusSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return jsonError(
      parsedBody.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
      400,
      requestId,
      "INVALID_INPUT",
    );
  }

  try {
    const result = await updateAdminMiniAppStatus(parsedParams.data.id, parsedBody.data.status);
    if (!result) {
      return jsonError(
        "미니앱을 찾을 수 없습니다.",
        404,
        requestId,
        "MINI_APP_NOT_FOUND",
      );
    }

    return jsonData(result, requestId);
  } catch (error) {
    return serverError(
      "admin.mini_app.status.failed",
      error,
      requestId,
      "미니앱 상태를 변경하지 못했습니다.",
      { miniAppId: parsedParams.data.id },
    );
  }
}
