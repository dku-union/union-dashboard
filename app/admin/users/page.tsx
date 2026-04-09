"use client";

import { AdminUserTable } from "@/components/admin/admin-user-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">플랫폼 계정 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          현재 인증 모델 기준의 플랫폼 계정과 관리자 권한 현황을 확인합니다.
        </p>
      </div>
      <div className="animate-fade-up delay-2">
        <AdminUserTable />
      </div>
    </div>
  );
}
