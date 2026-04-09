"use client";

import { AdminUserTable } from "@/components/admin/admin-user-table";
import { mockAdminRoles, mockAdminUsers } from "@/data/admin-users";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">사용자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 사용자 목록과 관리자 권한 등급을 함께 관리합니다.
        </p>
      </div>
      <div className="animate-fade-up delay-2">
        <AdminUserTable initialUsers={mockAdminUsers} adminRoles={mockAdminRoles} />
      </div>
    </div>
  );
}
