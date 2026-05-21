"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCheck,
  CheckCircle2,
  ClipboardList,
  FileClock,
  Search,
  ShieldAlert,
} from "lucide-react";
import type { AdminReviewDetail, AdminReviewListItem } from "@/types/admin-review";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import { MiniAppStatusBadge } from "@/components/apps/mini-app-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminReviewDetailDialog } from "@/components/admin/admin-review-detail-dialog";

const statusFilters: {
  label: string;
  value: AdminReviewListItem["versionStatus"] | "all";
}[] = [
  { label: "전체", value: "all" },
  { label: "심사 중", value: "IN_REVIEW" },
  { label: "반려됨", value: "REJECTED" },
  { label: "승인됨", value: "ACCEPTED" },
  { label: "배포됨", value: "DEPLOYED" },
];

interface ApiErrorPayload {
  error?: string;
  requestId?: string;
}

function apiErrorMessage(payload: ApiErrorPayload, fallback: string) {
  const message = payload.error || fallback;
  if (!payload.requestId) return message;

  return `${message} 요청 ID: ${payload.requestId.slice(0, 8)}`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ko-KR");
}

function getAgeDays(value: string | null) {
  if (!value) return null;

  const submittedAt = new Date(value).getTime();
  if (Number.isNaN(submittedAt)) return null;

  const diff = Date.now() - submittedAt;
  return Math.max(0, Math.floor(diff / 86400000));
}

function getReviewPriority(review: AdminReviewListItem) {
  if (review.versionStatus === "IN_REVIEW") {
    const ageDays = getAgeDays(review.submittedAt);
    if (ageDays !== null && ageDays >= 3) {
      return {
        label: "지연",
        caption: `${ageDays}일 대기`,
        className: "border-destructive/30 bg-destructive/5 text-destructive",
      };
    }

    return {
      label: "검토 필요",
      caption: ageDays === null ? "대기 중" : `${ageDays}일 대기`,
      className: "border-gold/30 bg-gold/10 text-gold",
    };
  }

  if (review.versionStatus === "REJECTED") {
    return {
      label: "재제출 대기",
      caption: review.reviewedAt ? `검토 ${formatDate(review.reviewedAt)}` : "반려됨",
      className: "border-border/60 bg-muted/30 text-muted-foreground",
    };
  }

  if (review.versionStatus === "ACCEPTED") {
    return {
      label: "배포 대기",
      caption: "퍼블리셔 배포 가능",
      className: "border-sage/30 bg-sage/10 text-sage",
    };
  }

  return {
    label: "완료",
    caption: review.reviewedAt ? `검토 ${formatDate(review.reviewedAt)}` : "운영 완료",
    className: "border-border/60 bg-muted/20 text-muted-foreground",
  };
}

export function AdminReviewBoard() {
  const [reviews, setReviews] = useState<AdminReviewListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AdminReviewListItem["versionStatus"] | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<AdminReviewDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/reviews", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(apiErrorMessage(data, "심사 목록을 불러오지 못했습니다."));
      }

      setReviews(data.reviews);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "심사 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesFilter = filter === "all" || review.versionStatus === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        review.miniAppName.toLowerCase().includes(normalizedQuery) ||
        (review.publisherName ?? "").toLowerCase().includes(normalizedQuery) ||
        (review.publisherEmail ?? "").toLowerCase().includes(normalizedQuery) ||
        review.versionNumber.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    }).sort((a, b) => {
      const statusWeight = {
        IN_REVIEW: 0,
        REJECTED: 1,
        ACCEPTED: 2,
        DEPLOYED: 3,
        UPLOADED: 4,
        DRAFT: 5,
      } satisfies Record<AdminReviewListItem["versionStatus"], number>;

      const weightDiff = statusWeight[a.versionStatus] - statusWeight[b.versionStatus];
      if (weightDiff !== 0) return weightDiff;

      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });
  }, [filter, query, reviews]);

  const metrics = useMemo(() => {
    const inReview = reviews.filter((review) => review.versionStatus === "IN_REVIEW").length;
    const rejected = reviews.filter((review) => review.versionStatus === "REJECTED").length;
    const approved = reviews.filter(
      (review) => review.versionStatus === "ACCEPTED" || review.versionStatus === "DEPLOYED",
    ).length;

    const delayed = reviews.filter((review) => {
      const ageDays = getAgeDays(review.submittedAt);
      return review.versionStatus === "IN_REVIEW" && ageDays !== null && ageDays >= 3;
    }).length;

    return [
      {
        label: "심사 대기",
        value: inReview,
        caption: "승인/반려 판단 필요",
        icon: FileClock,
        tone: "text-gold",
        bg: "bg-gold/10",
      },
      {
        label: "지연 검토",
        value: delayed,
        caption: "3일 이상 대기",
        icon: AlertTriangle,
        tone: "text-destructive",
        bg: "bg-destructive/10",
      },
      {
        label: "반려 건",
        value: rejected,
        caption: "재제출 가능 상태",
        icon: ShieldAlert,
        tone: "text-destructive",
        bg: "bg-destructive/10",
      },
      {
        label: "승인 건",
        value: approved,
        caption: "승인 또는 배포 완료",
        icon: CheckCircle2,
        tone: "text-sage",
        bg: "bg-sage/10",
      },
    ];
  }, [reviews]);

  const openDetail = async (versionId: string) => {
    setSelectedVersionId(versionId);
    setDetailOpen(true);
    setDetailLoading(true);

    try {
      const response = await fetch(`/api/admin/reviews/${versionId}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(apiErrorMessage(data, "심사 상세를 불러오지 못했습니다."));
      }

      setSelectedReview(data.review);
    } catch (fetchError) {
      toast.error(fetchError instanceof Error ? fetchError.message : "심사 상세를 불러오지 못했습니다.");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReview || actionLoading) return;

    setActionLoading("approve");

    try {
      const response = await fetch(`/api/admin/reviews/${selectedReview.versionId}/approve`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(apiErrorMessage(data, "승인 처리에 실패했습니다."));
      }

      const updatedReview = data.review as AdminReviewDetail;

      setReviews((current) =>
        current.map((review) =>
          review.versionId === updatedReview.versionId ? updatedReview : review,
        ),
      );

      setSelectedReview(updatedReview);

      toast.success("승인 처리되었습니다.");
    } catch (actionError) {
      toast.error(actionError instanceof Error ? actionError.message : "승인 처리에 실패했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const startReject = () => {
    setDetailOpen(false);
    setRejectReason(selectedReview?.reviewReason ?? "");
    setRejectOpen(true);
  };

  const handleReject = async () => {
    if (!selectedReview || actionLoading) return;

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      toast.error("반려 사유를 입력해주세요.");
      return;
    }

    setActionLoading("reject");

    try {
      const response = await fetch(`/api/admin/reviews/${selectedReview.versionId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: trimmedReason }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(apiErrorMessage(data, "반려 처리에 실패했습니다."));
      }

      const updatedReview = data.review as AdminReviewDetail;

      setReviews((current) =>
        current.map((review) =>
          review.versionId === updatedReview.versionId ? updatedReview : review,
        ),
      );

      setSelectedReview(updatedReview);
      setRejectOpen(false);
      setRejectReason("");

      toast.success("반려 처리되었습니다.");
    } catch (actionError) {
      toast.error(actionError instanceof Error ? actionError.message : "반려 처리에 실패했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="animate-fade-up border-border/60">
          <CardContent className="grid gap-3 p-4 md:grid-cols-4">
            <OperationStep title="1. 제출 확인" description="릴리즈 노트와 문의 채널 확인" />
            <OperationStep title="2. QR 테스트" description="모바일 앱에서 실제 실행 상태 확인" />
            <OperationStep title="3. 판단 기록" description="승인 또는 구체적인 반려 사유 작성" />
            <OperationStep title="4. 배포 대기" description="승인된 버전은 퍼블리셔가 배포" />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={metric.label} className={`card-hover animate-fade-up delay-${index + 1} border-border/60`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="heading-display mt-2 text-3xl">{metric.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{metric.caption}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bg}`}>
                    <metric.icon className={`h-5 w-5 ${metric.tone}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="animate-fade-up delay-4 border-border/60">
          <CardHeader className="gap-4 border-b border-border/60 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle className="heading-display text-lg">심사 큐</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                제출된 앱 버전을 검토하고 승인 또는 반려를 처리합니다.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[320px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="앱명, 퍼블리셔명, 이메일, 버전 검색"
                  className="h-10 border-border/60 bg-muted/20 pl-9"
                />
              </div>
              <Tabs value={filter} onValueChange={(value) => setFilter(value as AdminReviewListItem["versionStatus"] | "all")}>
                <TabsList>
                  {statusFilters.map((status) => (
                    <TabsTrigger key={status.value} value={status.value} className="text-xs">
                      {status.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/40 py-16 text-center">
                <ShieldAlert className="h-8 w-8 text-destructive/70" />
                <h3 className="heading-display mt-4 text-lg">심사 목록을 불러오지 못했습니다</h3>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4 border-border/60" onClick={() => void fetchReviews()}>
                  다시 시도
                </Button>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16 text-center">
                <CheckCheck className="h-8 w-8 text-muted-foreground/40" />
                <h3 className="heading-display mt-4 text-lg">표시할 심사 건이 없습니다</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  현재 필터 조건에 맞는 앱 제출 내역이 없습니다.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60">
                    <TableHead>앱 정보</TableHead>
                    <TableHead>퍼블리셔</TableHead>
                    <TableHead>운영 상태</TableHead>
                    <TableHead>버전 상태</TableHead>
                    <TableHead>앱 상태</TableHead>
                    <TableHead>제출일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => {
                    const priority = getReviewPriority(review);

                    return (
                      <TableRow
                        key={review.versionId}
                        className="cursor-pointer border-border/50"
                        onClick={() => void openDetail(review.versionId)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            void openDetail(review.versionId);
                          }
                        }}
                        tabIndex={0}
                      >
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="font-medium">{review.miniAppName}</p>
                            <p className="text-xs font-mono text-muted-foreground/70">v{review.versionNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{review.publisherName ?? "-"}</p>
                            <p className="text-xs text-muted-foreground">{review.publisherEmail ?? "-"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex min-w-28 flex-col rounded-lg border px-2.5 py-1.5 ${priority.className}`}>
                            <span className="text-xs font-semibold">{priority.label}</span>
                            <span className="mt-0.5 text-[11px] opacity-80">{priority.caption}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <VersionStatusBadge status={review.versionStatus} />
                        </TableCell>
                        <TableCell>
                          <MiniAppStatusBadge status={review.miniAppStatus as "PENDING" | "APPROVED"} />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p>{formatDate(review.submittedAt)}</p>
                            {review.reviewedAt ? (
                              <p className="text-xs text-muted-foreground">검토: {formatDate(review.reviewedAt)}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">검토 대기</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminReviewDetailDialog
        review={selectedReview}
        open={detailOpen}
        isLoading={detailLoading}
        onOpenChange={setDetailOpen}
        onApprove={() => void handleApprove()}
        onStartReject={startReject}
        actionLoading={actionLoading}
      />

      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open && selectedVersionId) {
            setDetailOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="heading-display text-lg">반려 사유 작성</DialogTitle>
            <DialogDescription>
              {selectedReview?.miniAppName} v{selectedReview?.versionNumber} 반려 사유를 기록합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">관리자 메모</p>
            <Textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="심사 반려 사유를 구체적으로 입력하세요."
              className="min-h-32 border-border/60 bg-muted/20"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={() => void handleReject()} disabled={actionLoading === "reject"}>
              반려 확정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function OperationStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card">
        <ClipboardList className="h-4 w-4 text-union" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <ArrowUpRight className="ml-auto hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/50 md:block" />
    </div>
  );
}
