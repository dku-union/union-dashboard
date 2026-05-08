"use client";

import { ReviewStatusBoard } from "@/components/reviews/review-status-board";
import { useMyMiniApps, useMyReviews } from "@/hooks/use-app-versions";
import type { Review } from "@/types/app-version";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ReviewsPage() {
  const router = useRouter();
  const { reviews, isLoading, refetch } = useMyReviews();
  const { apps } = useMyMiniApps();

  const handleUploadNewVersion = (review: Review) => {
    const app = apps.find((item) => item.name === review.miniAppName);
    if (app) {
      const params = new URLSearchParams({
        miniAppId: String(app.id),
        rejectedVersion: review.versionNumber,
      });
      router.push(`/workspace/${app.workspaceId}/upload?${params.toString()}`);
      return;
    }

    toast.error("업로드할 미니앱을 찾지 못했습니다. 미니앱 상세에서 새 버전을 업로드해주세요.");
    refetch();
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
          onUploadNewVersion={handleUploadNewVersion}
        />
      </div>
    </div>
  );
}
