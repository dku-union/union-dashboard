"use client";

import { AdminReportTable } from "@/components/admin/admin-report-table";
import { mockAdminReports, mockAdminUserReports } from "@/data/admin-reports";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">신고 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          접수된 신고를 검토하고 경고, 중지, 삭제 조치를 수행하세요.
        </p>
      </div>
      <div className="animate-fade-up delay-2">
        <AdminReportTable
          initialAppReports={mockAdminReports}
          initialUserReports={mockAdminUserReports}
        />
      </div>
    </div>
  );
}
