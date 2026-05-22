import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminDashboardData } from "@/lib/admin/dashboard";
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
    const dashboard = await getAdminDashboardData();
    return jsonData(dashboard, requestId);
  } catch (error) {
    return serverError(
      "admin.dashboard.failed",
      error,
      requestId,
      "대시보드 데이터를 불러오지 못했습니다.",
    );
  }
}
