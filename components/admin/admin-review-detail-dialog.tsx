"use client";

import { AlertTriangle, CheckCircle2, Mail, ShieldCheck, Zap } from "lucide-react";
import { StatusBadge } from "@/components/apps/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORY_LABELS, PERMISSION_LABELS } from "@/lib/constants";
import { AdminReviewRecord } from "@/types/admin";

interface AdminReviewDetailDialogProps {
  review: AdminReviewRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onStartReject: () => void;
}

function ScanBadge({
  tone,
  label,
}: {
  tone: "pass" | "warning";
  label: string;
}) {
  const isPass = tone === "pass";

  return (
    <Badge
      variant="outline"
      className={isPass ? "border-sage/30 bg-sage/10 text-sage" : "border-gold/30 bg-gold/10 text-gold"}
    >
      {isPass ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </Badge>
  );
}

export function AdminReviewDetailDialog({
  review,
  open,
  onOpenChange,
  onApprove,
  onStartReject,
}: AdminReviewDetailDialogProps) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="heading-display text-xl">{review.appName}</DialogTitle>
                <StatusBadge status={review.status} />
              </div>
              <DialogDescription className="text-sm leading-relaxed">
                {review.shortDescription}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="border-border/60 bg-muted/40">
              {CATEGORY_LABELS[review.category]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-4 px-6 py-5 lg:grid-cols-[1.5fr_1fr]">
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                제출 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">퍼블리셔</p>
                  <p className="mt-1 text-sm font-medium">{review.publisherName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{review.publisherEmail}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">고객 문의</p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{review.contactEmail}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">버전</p>
                  <p className="mt-1 text-sm font-mono">v{review.version}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">제출일</p>
                  <p className="mt-1 text-sm">{review.submittedAt}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">릴리즈 노트</p>
                <p className="mt-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-3 text-sm leading-relaxed">
                  {review.releaseNote}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">요청 권한</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {review.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="border-border/60 bg-background">
                      {PERMISSION_LABELS[permission].label}
                    </Badge>
                  ))}
                </div>
              </div>

              {(review.reviewerNote || review.rejectionReasons?.length) && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">이전 심사 메모</p>
                  <div className="mt-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-3 text-sm leading-relaxed">
                    {review.reviewerNote && <p>{review.reviewerNote}</p>}
                    {review.rejectionReasons?.length ? (
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {review.rejectionReasons.map((reason) => (
                          <li key={reason}>• {reason}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                  자동 점검
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <ScanBadge tone={review.autoScanSummary.security} label="보안 점검" />
                  <ScanBadge tone={review.autoScanSummary.performance} label="성능 점검" />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {review.autoScanSummary.notes.map((note) => (
                    <p key={note} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 leading-relaxed">
                      {note}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                  심사 액션
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
                  승인 시 앱 상태가 게시됨으로 변경되고, 반려 시 사유가 즉시 기록됩니다.
                </div>
                <div className="grid gap-2">
                  <Button
                    onClick={onApprove}
                    disabled={review.status === "published"}
                    className="bg-union text-white hover:bg-union/90"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    승인 처리
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onStartReject}
                    disabled={review.status === "rejected"}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    반려 사유 작성
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
