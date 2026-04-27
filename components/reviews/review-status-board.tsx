"use client";

import { useState } from "react";
import type { Review, Verdict } from "@/types/app-version";
import { ReviewCard } from "./review-card";
import { RejectionDetail } from "./rejection-detail";
import { ResubmitDialog } from "./resubmit-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const columns: { verdict: Verdict; title: string; dotColor: string }[] = [
  { verdict: "PENDING", title: "심사 대기", dotColor: "bg-gold" },
  { verdict: "ACCEPTED", title: "승인됨", dotColor: "bg-sage" },
  { verdict: "REJECTED", title: "반려됨", dotColor: "bg-destructive" },
];

interface ReviewStatusBoardProps {
  reviews: Review[];
  isLoading?: boolean;
  onResubmit?: (versionId: string) => Promise<boolean>;
  isResubmitting?: boolean;
}

export function ReviewStatusBoard({
  reviews,
  isLoading,
  onResubmit,
  isResubmitting,
}: ReviewStatusBoardProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [rejectionOpen, setRejectionOpen] = useState(false);
  const [resubmitOpen, setResubmitOpen] = useState(false);

  const handleCardClick = (review: Review) => {
    if (review.verdict === "REJECTED") {
      setSelectedReview(review);
      setRejectionOpen(true);
    }
  };

  const handleResubmit = async () => {
    if (!selectedReview || !onResubmit) return;
    const success = await onResubmit(selectedReview.versionId);
    if (success) {
      setResubmitOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map(({ verdict }) => (
          <div key={verdict} className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map(({ verdict, title, dotColor }, colIdx) => {
          const columnReviews = reviews.filter((r) => r.verdict === verdict);
          return (
            <div key={verdict} className={`space-y-3 animate-fade-up delay-${colIdx + 1}`}>
              <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                <h3 className="text-label uppercase tracking-wider">{title}</h3>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {columnReviews.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {columnReviews.length === 0 ? (
                  <p className="text-caption text-muted-foreground/50 py-8 text-center">
                    항목 없음
                  </p>
                ) : (
                  columnReviews.map((review) => (
                    <div key={review.id}>
                      <ReviewCard
                        review={review}
                        onClick={() => handleCardClick(review)}
                      />
                      {review.verdict === "REJECTED" && onResubmit && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1 border-border/60 text-xs hover:border-union hover:text-union"
                          disabled={isResubmitting}
                          onClick={() => {
                            setSelectedReview(review);
                            setResubmitOpen(true);
                          }}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" />
                          재제출
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RejectionDetail
        review={selectedReview}
        open={rejectionOpen}
        onOpenChange={setRejectionOpen}
      />
      <ResubmitDialog
        review={selectedReview}
        open={resubmitOpen}
        onOpenChange={setResubmitOpen}
        onConfirm={handleResubmit}
        isLoading={isResubmitting}
      />
    </>
  );
}
