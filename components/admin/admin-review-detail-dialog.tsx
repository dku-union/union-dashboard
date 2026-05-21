"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";
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
  const canDecide = review?.versionStatus === "IN_REVIEW";

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

        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
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

                  <div className="grid gap-3 sm:grid-cols-3">
                    <ReviewSignal
                      label="QR 테스트"
                      value={review.testedAt ? "완료" : "확인 필요"}
                      ok={Boolean(review.testedAt)}
                    />
                    <ReviewSignal
                      label="릴리즈 노트"
                      value={review.releaseNotes ? "작성됨" : "비어 있음"}
                      ok={Boolean(review.releaseNotes)}
                    />
                    <ReviewSignal
                      label="문의 이메일"
                      value={review.contactEmail ? "등록됨" : "없음"}
                      ok={Boolean(review.contactEmail)}
                    />
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
              {isLoading || !review ? null : (
                <Card className="border-border/60 shadow-none">
                  <CardHeader>
                    <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                      운영 체크리스트
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ReviewCheck
                      done={Boolean(review.testedAt)}
                      title="모바일 QR 테스트"
                      description="슈퍼앱 WebView에서 핵심 화면과 권한 요청을 확인합니다."
                    />
                    <ReviewCheck
                      done={Boolean(review.releaseNotes)}
                      title="변경 사항 확인"
                      description="릴리즈 노트가 실제 변경 범위와 사용자 영향도를 설명하는지 봅니다."
                    />
                    <ReviewCheck
                      done={Boolean(review.contactEmail)}
                      title="운영 연락처 확인"
                      description="장애 또는 반려 안내를 받을 수 있는 연락처인지 확인합니다."
                    />
                    <ReviewCheck
                      done={review.bundleSize === null || review.bundleSize <= 50 * 1024 * 1024}
                      title="패키지 크기 확인"
                      description="콘솔 업로드 제한과 초기 로딩에 영향을 줄 수 있는 번들 크기를 점검합니다."
                    />
                  </CardContent>
                </Card>
              )}

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
                  {canDecide
                    ? "승인은 즉시 퍼블리셔의 배포 가능 상태로 이어집니다. 반려 시 퍼블리셔가 바로 수정할 수 있도록 구체적인 사유를 남겨주세요."
                    : "심사 중 상태의 버전에 대해서만 승인 또는 반려를 처리할 수 있습니다."}
                </div>
                <div className="grid gap-2">
                  <Button
                    onClick={onApprove}
                    disabled={!review || !canDecide || actionLoading !== null}
                    className="bg-union text-white hover:bg-union/90"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    승인 처리
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onStartReject}
                    disabled={!review || !canDecide || actionLoading !== null}
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

function ReviewSignal({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-1.5 text-sm font-medium">
        {ok ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-sage" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 text-gold" />
        )}
        <span>{value}</span>
      </div>
    </div>
  );
}

function ReviewCheck({
  done,
  title,
  description,
}: {
  done: boolean;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-sage/10" : "bg-gold/10"}`}>
        {done ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-sage" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 text-gold" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
