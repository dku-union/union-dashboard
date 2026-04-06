"use client";

import { AdminReviewBoard } from "@/components/admin/admin-review-board";

export default function AdminAppsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">앱 심사</h1>
        <div className="mt-3 h-0.5 w-8 bg-union" />
      </div>

      <div className="animate-fade-up delay-2">
        <AdminReviewBoard />
      </div>
    </div>
  );
}
