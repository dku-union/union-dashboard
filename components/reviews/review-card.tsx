"use client";

import { ReviewRecord } from "@/types/review";
import { StatusBadge } from "@/components/apps/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppWindow } from "lucide-react";

interface ReviewCardProps {
  review: ReviewRecord;
  onClick?: () => void;
}

export function ReviewCard({ review, onClick }: ReviewCardProps) {
  return (
    <Card
      className={`card-hover cursor-pointer border-border/60 ${
        review.status === "rejected" ? "border-l-2 border-l-destructive" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <AppWindow className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="text-sm font-semibold truncate">{review.appName}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-mono">
                v{review.version}
              </span>
              <StatusBadge status={review.status} />
            </div>
            <p className="text-[11px] text-muted-foreground/60">
              {review.submittedAt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
