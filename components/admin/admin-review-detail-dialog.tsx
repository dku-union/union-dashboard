"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2, Mail, ShieldCheck, Smartphone, XCircle } from "lucide-react";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import { MiniAppStatusBadge } from "@/components/apps/mini-app-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminReviewDetail } from "@/types/admin-review";

interface AdminReviewDetailDialogProps {
  review: AdminReviewDetail | null;
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onStartReject: () => void;
  actionLoading: "approve" | "reject" | null;
}

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

function formatBytes(value: number | null) {
  if (!value) return "-";

  const units = ["B", "KB", "MB", "GB"];
  let current = value;
  let index = 0;

  while (current >= 1024 && index < units.length - 1) {
    current /= 1024;
    index += 1;
  }

  return `${current.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function AdminReviewDetailDialog({
  review,
  open,
  isLoading,
  onOpenChange,
  onApprove,
  onStartReject,
  actionLoading,
}: AdminReviewDetailDialogProps) {
  const [testLinkState, setTestLinkState] = useState<{
    versionId: string;
    url: string | null;
    status: "loaded" | "failed";
  } | null>(null);
  const [isTestLinkLoading, setIsTestLinkLoading] = useState(false);
  const reviewVersionId = review?.versionId;
  const shouldShowReviewQr = open && review?.versionStatus === "IN_REVIEW";
  const currentTestLinkState =
    reviewVersionId && testLinkState?.versionId === reviewVersionId ? testLinkState : null;
  const testLink = currentTestLinkState?.url ?? null;
  const isQrLoading = shouldShowReviewQr && !currentTestLinkState;
  const isQrFailed = currentTestLinkState?.status === "failed";

  useEffect(() => {
    if (!shouldShowReviewQr || !reviewVersionId) {
      return;
    }

    let ignore = false;
    const versionId = reviewVersionId;

    async function createTestSession() {
      setIsTestLinkLoading(true);
      try {
        const response = await fetch(`/api/app-versions/${versionId}/test-session`, {
          method: "POST",
        });
        const data = await response.json();
        const url = response.ok ? data.testLink : null;

        if (!ignore) {
          setTestLinkState({
            versionId,
            url,
            status: url ? "loaded" : "failed",
          });
        }
      } catch {
        if (!ignore) {
          setTestLinkState({
            versionId,
            url: null,
            status: "failed",
          });
        }
      } finally {
        if (!ignore) {
          setIsTestLinkLoading(false);
        }
      }
    }

    void createTestSession();

    return () => {
      ignore = true;
    };
  }, [reviewVersionId, shouldShowReviewQr]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5">
          {isLoading || !review ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="heading-display text-xl">{review.miniAppName}</DialogTitle>
                <VersionStatusBadge status={review.versionStatus} />
                <MiniAppStatusBadge status={review.miniAppStatus as "PENDING" | "APPROVED"} />
              </div>
              <DialogDescription className="text-sm leading-relaxed">
                {review.miniAppDescription || "앱 설명이 없습니다."}
              </DialogDescription>
            </div>
          )}
        </DialogHeader>

        <div className="grid gap-4 px-6 py-5 lg:grid-cols-[1.5fr_1fr]">
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                제출 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading || !review ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">퍼블리셔</p>
                      <p className="mt-1 text-sm font-medium">{review.publisherName ?? "-"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{review.publisherEmail ?? "-"}</p>
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
                      <p className="mt-1 text-sm font-mono">v{review.versionNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">제출일</p>
                      <p className="mt-1 text-sm">{formatDateTime(review.submittedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">번들 크기</p>
                      <p className="mt-1 text-sm">{formatBytes(review.bundleSize)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">테스트 시각</p>
                      <p className="mt-1 text-sm">{formatDateTime(review.testedAt)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">릴리즈 노트</p>
                    <p className="mt-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {review.releaseNotes || "등록된 릴리즈 노트가 없습니다."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">빌드 파일</p>
                    {review.buildFileUrl ? (
                      <a
                        href={review.buildFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm hover:bg-muted/40"
                      >
                        <Download className="h-4 w-4" />
                        빌드 파일 열기
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">빌드 파일 URL이 없습니다.</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {isLoading || !review ? null : review.versionStatus === "IN_REVIEW" ? (
              <Card className="border-border/60 shadow-none">
                <CardHeader>
                  <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                    Test QR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    {isTestLinkLoading || isQrLoading ? (
                      <div className="flex h-44 w-44 items-center justify-center rounded-lg border border-border/60 bg-muted/20">
                        <Loader2 className="h-7 w-7 animate-spin text-union" />
                      </div>
                    ) : testLink ? (
                      <>
                        <div className="rounded-xl border border-border/60 bg-white p-3">
                          <QRCodeSVG value={testLink} size={176} level="M" />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm font-medium">
                          <Smartphone className="h-4 w-4 text-union" />
                          <span>Scan this QR with the mobile app.</span>
                        </div>
                      </>
                    ) : isQrFailed ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        Test link could not be loaded.
                      </p>
                    ) : null}
                    {isQrFailed && review.buildFileUrl ? (
                      <a
                        href={review.buildFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Open build file directly
                      </a>
                    ) : null}
                    {isQrFailed && !review.buildFileUrl ? (
                      <p className="text-center text-xs text-muted-foreground">
                        This review version has no build file URL.
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ) : null}
            <Card className="border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                  최근 심사 이력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading || !review ? (
                  <div className="space-y-3">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                ) : review.reviewHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">아직 심사 이력이 없습니다.</p>
                ) : (
                  review.reviewHistory.map((item) => (
                    <div key={item.reviewId} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">v{item.versionNumber}</p>
                        <VersionStatusBadge status={item.verdict === "ACCEPTED" ? "ACCEPTED" : "REJECTED"} />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.reviewerName ?? "관리자"} · {formatDateTime(item.reviewedAt)}
                      </p>
                      {item.reason ? (
                        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{item.reason}</p>
                      ) : null}
                    </div>
                  ))
                )}
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
                  심사 중 상태의 버전에 대해서만 승인 또는 반려를 처리할 수 있습니다.
                </div>
                <div className="grid gap-2">
                  <Button
                    onClick={onApprove}
                    disabled={!review || review.versionStatus !== "IN_REVIEW" || actionLoading !== null}
                    className="bg-union text-white hover:bg-union/90"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    승인 처리
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onStartReject}
                    disabled={!review || review.versionStatus !== "IN_REVIEW" || actionLoading !== null}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
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
