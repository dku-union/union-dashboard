"use client";

import { ReviewRecord } from "@/types/review";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface Props {
  review: ReviewRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RejectionDetail({ review, open, onOpenChange }: Props) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 heading-display">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            반려 상세
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {review.appName} v{review.version}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {review.reviewerNote && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">심사 의견</p>
              <p className="text-sm leading-relaxed">
                {review.reviewerNote}
              </p>
            </div>
          )}
          {review.rejectionReasons && review.rejectionReasons.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">반려 사유</p>
              <ul className="space-y-2">
                {review.rejectionReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-destructive/10 text-destructive text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.reviewedAt && (
            <p className="text-[11px] text-muted-foreground/60 font-mono pt-2 border-t border-border/40">
              심사일: {review.reviewedAt}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
