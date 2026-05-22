import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminPublishers } from "@/lib/admin/publishers";
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

  try {
    const publishers = await listAdminPublishers();
    return jsonData({ publishers }, requestId);
  } catch (error) {
    return serverError(
      "admin.publishers.list.failed",
      error,
      requestId,
      "퍼블리셔 목록을 불러오지 못했습니다.",
    );
  }
}
