import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { updateAdminPublisherStatus } from "@/lib/admin/publishers";
import { adminPublisherStatusSchema } from "@/lib/validations";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const paramsSchema = z.object({
  id: z.string().uuid("유효하지 않은 퍼블리셔 ID입니다."),
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

  const parsedBody = adminPublisherStatusSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return jsonError(
      parsedBody.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
      400,
      requestId,
      "INVALID_INPUT",
    );
  }

  try {
    const result = await updateAdminPublisherStatus(parsedParams.data.id, parsedBody.data.status);
    if (!result) {
      return jsonError(
        "퍼블리셔를 찾을 수 없습니다.",
        404,
        requestId,
        "PUBLISHER_NOT_FOUND",
      );
    }

    return jsonData(result, requestId);
  } catch (error) {
    return serverError(
      "admin.publisher.status.failed",
      error,
      requestId,
      "퍼블리셔 상태를 변경하지 못했습니다.",
      { publisherId: parsedParams.data.id },
    );
  }
}
