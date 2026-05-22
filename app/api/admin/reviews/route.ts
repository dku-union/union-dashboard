import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminReviews } from "@/lib/admin/reviews";
import { adminReviewListQuerySchema } from "@/lib/validations";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return jsonError(auth.error, auth.status, requestId, "ADMIN_AUTH_FAILED");
  }

  const { searchParams } = new URL(request.url);
  const parsed = adminReviewListQuerySchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return jsonError("조회 조건이 올바르지 않습니다.", 400, requestId, "INVALID_QUERY");
  }

  try {
    const reviews = await listAdminReviews(parsed.data.status, parsed.data.q);
    return jsonData({ reviews }, requestId);
  } catch (error) {
    return serverError(
      "admin.reviews.list.failed",
      error,
      requestId,
      undefined,
      { status: parsed.data.status, q: parsed.data.q },
    );
  }
}
