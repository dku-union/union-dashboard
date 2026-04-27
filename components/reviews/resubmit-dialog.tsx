"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Review } from "@/types/app-version";

interface Props {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ResubmitDialog({ review, open, onOpenChange, onConfirm, isLoading }: Props) {
  if (!review) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/60">
        <AlertDialogHeader>
          <AlertDialogTitle className="heading-display">심사 재제출</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold">{review.miniAppName}</span>{" "}
            <span className="font-mono text-xs">v{review.versionNumber}</span>을(를) 심사에 다시 제출하시겠습니까?
            반려 사유를 해결한 후 재제출해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border/60">취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-union text-white hover:bg-union/90"
          >
            재제출
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
