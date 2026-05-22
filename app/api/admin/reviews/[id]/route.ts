import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminReviewDetail } from "@/lib/admin/reviews";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const paramsSchema = z.object({
  id: z.string().uuid("유효하지 않은 버전 ID입니다."),
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
    const review = await getAdminReviewDetail(parsedParams.data.id);

    if (!review) {
      return jsonError(
        "심사 대상을 찾을 수 없습니다.",
        404,
        requestId,
        "REVIEW_NOT_FOUND",
      );
    }

    return jsonData({ review }, requestId);
  } catch (error) {
    return serverError(
      "admin.review.detail.failed",
      error,
      requestId,
      undefined,
      { versionId: parsedParams.data.id },
    );
  }
}
