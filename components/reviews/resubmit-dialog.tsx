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
}

export function ResubmitDialog({ review, open, onOpenChange, onConfirm }: Props) {
  if (!review) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/60">
        <AlertDialogHeader>
          <AlertDialogTitle className="heading-display">새 버전 업로드</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold">{review.miniAppName}</span>{" "}
            <span className="font-mono text-xs">v{review.versionNumber}</span>은(는) 반려되었습니다.
            반려 사유를 반영한 새 빌드 파일을 업로드한 뒤 테스트와 심사를 다시 진행해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border/60">취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-union text-white hover:bg-union/90"
          >
            업로드로 이동
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
