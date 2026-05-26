import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import {
  REPORT_ACTION_VALUES,
  REPORT_STATUS_VALUES,
  updateAdminReport,
} from "@/lib/admin/reports";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import type { AdminReportStatus } from "@/types/admin";

const updateReportSchema = z.object({
  status: z.enum(REPORT_STATUS_VALUES),
  actionTaken: z.enum(REPORT_ACTION_VALUES),
});

function validateAction(status: AdminReportStatus, actionTaken: string) {
  if (status === "RESOLVED" && actionTaken === "NONE") {
    return "처리 완료 상태에는 조치가 필요합니다.";
  }

  if ((status === "PENDING" || status === "IN_PROGRESS" || status === "DISMISSED") && actionTaken !== "NONE") {
    return "대기, 처리 중, 기각 상태에서는 조치를 지정할 수 없습니다.";
  }

  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return jsonError(auth.error, auth.status, requestId, "ADMIN_AUTH_FAILED");
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = updateReportSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("입력값이 올바르지 않습니다.", 400, requestId, "INVALID_REPORT_UPDATE");
  }

  const validationError = validateAction(parsed.data.status, parsed.data.actionTaken);
  if (validationError) {
    return jsonError(validationError, 400, requestId, "INVALID_REPORT_ACTION");
  }

  try {
    const updatedReport = await updateAdminReport(id, {
      status: parsed.data.status,
      actionTaken: parsed.data.actionTaken,
      reviewedBy: auth.session.id,
    });

    if (!updatedReport) {
      return jsonError("신고를 찾을 수 없습니다.", 404, requestId, "REPORT_NOT_FOUND");
    }

    return jsonData(updatedReport, requestId);
  } catch (error) {
    return serverError(
      "admin.reports.update.failed",
      error,
      requestId,
      "신고 처리 중 오류가 발생했습니다.",
    );
  }
}
