import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminUsers } from "@/lib/admin/users";
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
    const data = await listAdminUsers();
    return jsonData(data, requestId);
  } catch (error) {
    return serverError(
      "admin.users.list.failed",
      error,
      requestId,
      "플랫폼 계정 목록을 불러오지 못했습니다.",
    );
  }
}
