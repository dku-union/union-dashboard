"use client";

import { AdminAppManagementTable } from "@/components/admin/admin-app-management-table";

export default function AdminMiniAppsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">미니앱 운영 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 미니앱 상태와 최신 버전 상태를 실데이터로 확인합니다.
        </p>
      </div>
      <div className="animate-fade-up delay-2">
        <AdminAppManagementTable />
      </div>
    </div>
  );
}
