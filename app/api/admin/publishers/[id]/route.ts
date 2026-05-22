import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminPublisherDetail } from "@/lib/admin/publishers";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const paramsSchema = z.object({
  id: z.string().uuid("유효하지 않은 퍼블리셔 ID입니다."),
});

export async function GET(
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

  try {
    const publisher = await getAdminPublisherDetail(parsedParams.data.id);
    if (!publisher) {
      return jsonError(
        "퍼블리셔를 찾을 수 없습니다.",
        404,
        requestId,
        "PUBLISHER_NOT_FOUND",
      );
    }

    return jsonData({ publisher }, requestId);
  } catch (error) {
    return serverError(
      "admin.publisher.detail.failed",
      error,
      requestId,
      "퍼블리셔 상세를 불러오지 못했습니다.",
      { publisherId: parsedParams.data.id },
    );
  }
}
