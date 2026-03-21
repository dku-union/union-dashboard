"use client";

import { AdminAppManagementTable } from "@/components/admin/admin-app-management-table";
import { mockAdminManagedApps } from "@/data/admin-apps";

export default function AdminMiniAppsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">미니앱 운영 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 미니앱 상태를 확인하고 강제 중지, 재개, 삭제를 수행하세요.
        </p>
        <div className="mt-3 h-0.5 w-8 bg-union" />
      </div>
      <div className="animate-fade-up delay-2">
        <AdminAppManagementTable initialApps={mockAdminManagedApps} />
      </div>
    </div>
  );
}
