"use client";

import type { Review } from "@/types/app-version";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AppWindow, CalendarDays, UserCheck } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  onClick?: () => void;
}

export function ReviewCard({ review, onClick }: ReviewCardProps) {
  return (
    <Card
      className={`cursor-pointer border-border/60 bg-card/80 shadow-none transition-colors hover:border-union/40 hover:bg-muted/25 ${
        review.verdict === "REJECTED" ? "border-l-2 border-l-destructive" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <AppWindow className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="text-sm font-semibold truncate">{review.miniAppName}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-mono">
                v{review.versionNumber}
              </span>
              {review.reviewerNickname && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
                  <UserCheck className="h-3 w-3" />
                  {review.reviewerNickname}
                </span>
              )}
            </div>
            <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60">
              <CalendarDays className="h-3 w-3" />
              {new Date(review.submittedAt).toLocaleDateString("ko-KR")}
            </p>
            {review.verdict === "REJECTED" && review.reason && (
              <div className="flex gap-1.5 rounded-md bg-destructive/5 px-2 py-1.5 text-[11px] leading-relaxed text-destructive">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                <p className="line-clamp-2 whitespace-pre-wrap">{review.reason}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
