import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminMiniApps } from "@/lib/admin/mini-apps";
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
    const apps = await listAdminMiniApps();
    return jsonData({ apps }, requestId);
  } catch (error) {
    return serverError(
      "admin.mini_apps.list.failed",
      error,
      requestId,
      "미니앱 목록을 불러오지 못했습니다.",
    );
  }
}
