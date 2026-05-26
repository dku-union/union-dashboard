import { AdminReportTable } from "@/components/admin/admin-report-table";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">신고 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          접수된 신고를 검토하고 처리 상태를 관리하세요.
        </p>
        <div className="mt-3 h-0.5 w-8 bg-union" />
      </div>
      <div className="animate-fade-up delay-2">
        <AdminReportTable />
      </div>
    </div>
  );
}
