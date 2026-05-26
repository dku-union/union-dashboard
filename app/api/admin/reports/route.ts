import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminReports } from "@/lib/admin/reports";
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
    const reports = await listAdminReports();
    return jsonData(reports, requestId);
  } catch (error) {
    return serverError(
      "admin.reports.list.failed",
      error,
      requestId,
      "신고 목록을 불러오지 못했습니다.",
    );
  }
}
