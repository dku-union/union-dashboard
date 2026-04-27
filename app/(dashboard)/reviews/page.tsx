"use client";

import { ReviewStatusBoard } from "@/components/reviews/review-status-board";
import { useMyReviews, useSubmitReview } from "@/hooks/use-app-versions";

export default function ReviewsPage() {
  const { reviews, isLoading, refetch } = useMyReviews();
  const { submitReview, isSubmitting } = useSubmitReview();

  const handleResubmit = async (versionId: string) => {
    const result = await submitReview(versionId);
    if (result) {
      refetch();
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-heading-1">심사 현황</h1>
        <p className="text-body-sm text-muted-foreground mt-1">
          미니앱 심사 진행 상황을 한눈에 확인하세요.
        </p>
      </div>
      <div className="animate-fade-up delay-2">
        <ReviewStatusBoard
          reviews={reviews}
          isLoading={isLoading}
          onResubmit={handleResubmit}
          isResubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
