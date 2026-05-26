import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import type {
  AdminReportListResponse,
  AdminReportReason,
  AdminReportRecord,
  AdminReportStatus,
  AdminReportTargetType,
  AdminReportUpdateResponse,
} from "@/types/admin";

export const REPORT_STATUS_VALUES = [
  "PENDING",
  "IN_PROGRESS",
  "RESOLVED",
  "DISMISSED",
] as const satisfies readonly AdminReportStatus[];

export const REPORT_ACTION_VALUES = [
  "NONE",
  "WARN",
  "HOLD_APP",
  "SUSPEND_APP",
  "DELETE_APP",
  "SUSPEND_USER",
] as const;

export type AdminReportAction = (typeof REPORT_ACTION_VALUES)[number];

interface ReportRow extends Record<string, unknown> {
  id: string;
  target_type: AdminReportTargetType;
  target_mini_app_name: string | null;
  target_review_id: string | null;
  target_review_app_name: string | null;
  reported_user_name: string | null;
  reported_user_email: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reason: AdminReportReason;
  detail: string | null;
  status: AdminReportStatus;
  action_taken: string | null;
  reviewed_by_name: string | null;
  reviewed_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface UpdatedReportRow extends Record<string, unknown> {
  id: string;
  status: AdminReportStatus;
  action_taken: string | null;
  reviewed_by_name: string | null;
  reviewed_at: Date | string | null;
  updated_at: Date | string;
}

function toIsoString(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toTargetLabel(row: ReportRow) {
  if (row.target_type === "MINI_APP") {
    return row.target_mini_app_name ?? "삭제되었거나 찾을 수 없는 미니앱";
  }

  if (row.target_type === "REVIEW") {
    return row.target_review_app_name
      ? `${row.target_review_app_name} 리뷰`
      : `리뷰 ${row.target_review_id ?? ""}`.trim();
  }

  return row.reported_user_name ?? "삭제되었거나 찾을 수 없는 사용자";
}

function toTargetSubLabel(row: ReportRow) {
  if (row.target_type === "MINI_APP") return "미니앱 신고";
  if (row.target_type === "REVIEW") return row.target_review_id ? `리뷰 ID ${row.target_review_id}` : "리뷰 신고";
  return row.reported_user_email;
}

function toReportRecord(row: ReportRow): AdminReportRecord {
  return {
    id: row.id,
    targetType: row.target_type,
    targetLabel: toTargetLabel(row),
    targetSubLabel: toTargetSubLabel(row),
    reporterName: row.reporter_name ?? "알 수 없음",
    reporterEmail: row.reporter_email ?? "-",
    reason: row.reason,
    detail: row.detail,
    status: row.status,
    actionTaken: row.action_taken ?? "NONE",
    reviewedByName: row.reviewed_by_name,
    reviewedAt: toIsoString(row.reviewed_at),
    createdAt: toIsoString(row.created_at) ?? "",
    updatedAt: toIsoString(row.updated_at) ?? "",
  };
}

export async function listAdminReports(): Promise<AdminReportListResponse> {
  const result = await db.execute<ReportRow>(sql`
    SELECT
      r.id,
      r.target_type,
      target_app.name AS target_mini_app_name,
      r.target_review_id,
      review_app.name AS target_review_app_name,
      reported_user.nickname AS reported_user_name,
      reported_user.email AS reported_user_email,
      reporter.nickname AS reporter_name,
      reporter.email AS reporter_email,
      r.reason,
      r.detail,
      r.status,
      r.action_taken,
      reviewer.name AS reviewed_by_name,
      r.reviewed_at,
      r.created_at,
      r.updated_at
    FROM reports r
    LEFT JOIN users reporter ON r.reporter_user_id = reporter.id
    LEFT JOIN mini_apps target_app ON r.target_mini_app_id = target_app.id
    LEFT JOIN reviews target_review ON r.target_review_id = target_review.id
    LEFT JOIN app_versions target_review_version ON target_review.version_id = target_review_version.id
    LEFT JOIN mini_apps review_app ON target_review_version.mini_app_id = review_app.id
    LEFT JOIN users reported_user ON r.reported_user_id = reported_user.id
    LEFT JOIN publishers reviewer ON r.reviewed_by = reviewer.publisher_id
    ORDER BY r.created_at DESC
  `);

  return {
    reports: result.rows.map(toReportRecord),
  };
}

export async function updateAdminReport(
  reportId: string,
  input: {
    status: AdminReportStatus;
    actionTaken: string;
    reviewedBy: string;
  },
): Promise<AdminReportUpdateResponse | null> {
  const result = await db.execute<UpdatedReportRow>(sql`
    UPDATE reports
    SET
      status = ${input.status},
      action_taken = ${input.actionTaken},
      reviewed_by = ${input.reviewedBy},
      reviewed_at = now(),
      updated_at = now()
    WHERE id = ${reportId}
    RETURNING
      id,
      status,
      action_taken,
      (
        SELECT name
        FROM publishers
        WHERE publisher_id = ${input.reviewedBy}
        LIMIT 1
      ) AS reviewed_by_name,
      reviewed_at,
      updated_at
  `);

  const [report] = result.rows;
  if (!report) return null;

  return {
    report: {
      id: report.id,
      status: report.status,
      actionTaken: report.action_taken ?? "NONE",
      reviewedByName: report.reviewed_by_name,
      reviewedAt: toIsoString(report.reviewed_at),
      updatedAt: toIsoString(report.updated_at) ?? "",
    },
  };
}
