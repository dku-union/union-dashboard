"use client";

import { AdminReviewBoard } from "@/components/admin/admin-review-board";
import { mockAdminReviews } from "@/data/admin-reviews";

export default function AdminAppsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">앱 심사</h1>
      </div>

      <div className="animate-fade-up delay-2">
        <AdminReviewBoard initialReviews={mockAdminReviews} />
      </div>
    </div>
  );
}
