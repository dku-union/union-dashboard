"use client";

import { useState } from "react";
import { ReviewRecord } from "@/types/review";
import { MiniAppStatus } from "@/types/mini-app";
import { ReviewCard } from "./review-card";
import { RejectionDetail } from "./rejection-detail";
import { ResubmitDialog } from "./resubmit-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

const columns: { status: MiniAppStatus; title: string; dotColor: string }[] = [
  { status: "draft", title: "임시저장", dotColor: "bg-muted-foreground/40" },
  { status: "in_review", title: "심사 중", dotColor: "bg-gold" },
  { status: "rejected", title: "반려됨", dotColor: "bg-destructive" },
  { status: "published", title: "게시됨", dotColor: "bg-sage" },
];

export function ReviewStatusBoard({ reviews }: { reviews: ReviewRecord[] }) {
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);
  const [rejectionOpen, setRejectionOpen] = useState(false);
  const [resubmitOpen, setResubmitOpen] = useState(false);

  const handleCardClick = (review: ReviewRecord) => {
    if (review.status === "rejected") {
      setSelectedReview(review);
      setRejectionOpen(true);
    }
  };

  const handleResubmit = () => {
    toast.success("재제출 완료", {
      description: `${selectedReview?.appName}이(가) 심사에 다시 제출되었습니다.`,
    });
    setResubmitOpen(false);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {columns.map(({ status, title, dotColor }, colIdx) => {
          const columnReviews = reviews.filter((r) => r.status === status);
          return (
            <div key={status} className={`space-y-3 animate-fade-up delay-${colIdx + 1}`}>
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
                      {review.status === "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1 border-border/60 text-xs hover:border-union hover:text-union"
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
      />
    </>
  );
}
