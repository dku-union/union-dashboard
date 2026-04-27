"use client";

import type { Review } from "@/types/app-version";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface Props {
  review: Review | null;
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
            {review.miniAppName} v{review.versionNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {review.reason && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">반려 사유</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {review.reason}
              </p>
            </div>
          )}
          {review.reviewerNickname && (
            <p className="text-[11px] text-muted-foreground/60">
              심사자: {review.reviewerNickname}
            </p>
          )}
          {review.decidedAt && (
            <p className="text-[11px] text-muted-foreground/60 font-mono pt-2 border-t border-border/40">
              심사일: {new Date(review.decidedAt).toLocaleDateString("ko-KR")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
