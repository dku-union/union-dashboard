"use client";

import { AdminPublisherTable } from "@/components/admin/admin-publisher-table";
import { mockAdminPublishers } from "@/data/admin-publishers";

export default function AdminPublishersPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">퍼블리셔 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          퍼블리셔 계정 상태와 등록 앱 현황을 한눈에 확인하세요.
        </p>
        <div className="mt-3 h-0.5 w-8 bg-union" />
      </div>

      <div className="animate-fade-up delay-2">
        <AdminPublisherTable initialPublishers={mockAdminPublishers} />
      </div>
    </div>
  );
}
