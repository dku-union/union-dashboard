import { AdminReportTable } from "@/components/admin/admin-report-table";
import { db } from "@/lib/db";
import { miniApps, publishers, reports, reviews, users } from "@/lib/db/schema";
import { AdminReportRecord } from "@/types/admin";
import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const dynamic = "force-dynamic";

async function getReports(): Promise<{
  reports: AdminReportRecord[];
  loadError?: string;
}> {
  try {
    const reporter = alias(users, "reporter");
    const reportedUser = alias(users, "reported_user");

    const rows = await db
      .select({
        id: reports.reportId,
        targetType: reports.targetType,
        targetMiniAppName: miniApps.name,
        targetReviewId: reviews.id,
        reportedUserName: reportedUser.nickname,
        reportedUserEmail: reportedUser.email,
        reporterName: reporter.nickname,
        reporterEmail: reporter.email,
        reason: reports.reason,
        detail: reports.detail,
        status: reports.status,
        actionTaken: reports.actionTaken,
        reviewedByName: publishers.name,
        reviewedAt: reports.reviewedAt,
        adminMemo: reports.adminMemo,
        createdAt: reports.createdAt,
      })
      .from(reports)
      .leftJoin(reporter, eq(reports.reporterUserId, reporter.id))
      .leftJoin(miniApps, eq(reports.targetMiniAppId, miniApps.id))
      .leftJoin(reviews, eq(reports.targetReviewId, reviews.id))
      .leftJoin(reportedUser, eq(reports.reportedUserId, reportedUser.id))
      .leftJoin(publishers, eq(reports.reviewedBy, publishers.publisherId))
      .orderBy(desc(reports.createdAt));

    return {
      reports: rows.map((report) => {
        const targetLabel =
          report.targetType === "MINI_APP"
            ? report.targetMiniAppName ?? "삭제되었거나 찾을 수 없는 미니앱"
            : report.targetType === "REVIEW"
              ? `리뷰 ${report.targetReviewId ?? ""}`.trim()
              : report.reportedUserName ?? "삭제되었거나 찾을 수 없는 사용자";

        const targetSubLabel =
          report.targetType === "USER"
            ? report.reportedUserEmail ?? undefined
            : report.targetType === "REVIEW"
              ? "리뷰 신고"
              : "미니앱 신고";

        return {
          id: report.id,
          targetType: report.targetType,
          targetLabel,
          targetSubLabel,
          reporterName: report.reporterName ?? "알 수 없음",
          reporterEmail: report.reporterEmail ?? "-",
          reason: report.reason,
          detail: report.detail ?? "",
          status: report.status,
          actionTaken: report.actionTaken,
          reviewedByName: report.reviewedByName ?? undefined,
          reviewedAt: report.reviewedAt?.toISOString(),
          adminMemo: report.adminMemo ?? undefined,
          createdAt: report.createdAt?.toISOString() ?? "",
        };
      }),
    };
  } catch (error) {
    console.error("Failed to load reports:", error);
    return {
      reports: [],
      loadError: "신고 목록을 불러오지 못했습니다. 데이터베이스 연결과 migration 적용 상태를 확인하세요.",
    };
  }
}

export default async function AdminReportsPage() {
  const { reports: initialReports, loadError } = await getReports();

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">신고 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          접수된 신고를 검토하고 경고, 중지, 삭제 조치를 수행하세요.
        </p>
        <div className="mt-3 h-0.5 w-8 bg-union" />
      </div>
      <div className="animate-fade-up delay-2">
        <AdminReportTable initialReports={initialReports} loadError={loadError} />
      </div>
    </div>
  );
}
