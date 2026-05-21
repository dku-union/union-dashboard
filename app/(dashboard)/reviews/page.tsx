"use client";

import { ReviewStatusBoard } from "@/components/reviews/review-status-board";
import { useMyMiniApps, useMyReviews } from "@/hooks/use-app-versions";
import type { Review } from "@/types/app-version";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

export default function ReviewsPage() {
  const router = useRouter();
  const { reviews, isLoading, refetch } = useMyReviews();
  const { apps } = useMyMiniApps();
  const pendingCount = reviews.filter((review) => review.verdict === "PENDING").length;
  const acceptedCount = reviews.filter((review) => review.verdict === "ACCEPTED").length;
  const rejectedCount = reviews.filter((review) => review.verdict === "REJECTED").length;

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
    <div className="publisher-page">
      <div className="publisher-page-header animate-fade-up">
        <div className="max-w-2xl">
          <p className="publisher-eyebrow">Review Board</p>
          <h1 className="text-heading-1">심사 현황</h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            대기, 승인, 반려 항목을 구분해 보고 반려된 버전은 바로 수정 업로드로 이어갈 수 있습니다.
          </p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/80 px-4 py-3 text-right">
          <p className="publisher-eyebrow">전체 요청</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{reviews.length}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 animate-fade-up delay-1">
        <div className="publisher-panel rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="publisher-eyebrow">심사 대기</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{pendingCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">검토가 시작될 항목</p>
            </div>
            <Clock3 className="h-4 w-4 text-gold" />
          </div>
        </div>
        <div className="publisher-panel rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="publisher-eyebrow">승인됨</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{acceptedCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">배포 진행 가능</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-sage" />
          </div>
        </div>
        <div className="publisher-panel rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="publisher-eyebrow">반려됨</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{rejectedCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">수정 버전 필요</p>
            </div>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
        </div>
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
