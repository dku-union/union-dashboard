"use client";

import { AdminPublisherTable } from "@/components/admin/admin-publisher-table";

export default function AdminPublishersPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">퍼블리셔 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          퍼블리셔 계정 상태와 등록 앱 현황을 실데이터 기준으로 확인합니다.
        </p>
      </div>

      <div className="animate-fade-up delay-2">
        <AdminPublisherTable />
      </div>
    </div>
  );
}
