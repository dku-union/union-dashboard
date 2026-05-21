"use client";

import { AdminReviewBoard } from "@/components/admin/admin-review-board";

export default function AdminAppsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Review Operations
        </p>
        <h1 className="heading-display mt-2 text-2xl tracking-tight">앱 심사 운영</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          퍼블리셔가 제출한 버전을 테스트하고, 승인 또는 반려 판단을 기록하는 운영 화면입니다.
          오래 대기 중인 심사와 반려 후 재제출 이력을 우선 확인하세요.
        </p>
        <div className="mt-3 h-0.5 w-8 bg-union" />
      </div>

      <div className="animate-fade-up delay-2">
        <AdminReviewBoard />
      </div>
    </div>
  );
}
