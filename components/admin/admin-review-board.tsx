"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCheck,
  FileClock,
  Search,
  ShieldAlert,
} from "lucide-react";
import { AdminReviewRecord } from "@/types/admin";
import { MiniAppStatus } from "@/types/mini-app";
import { CATEGORY_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/apps/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const statusFilters: { label: string; value: MiniAppStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "심사 중", value: "in_review" },
  { label: "반려됨", value: "rejected" },
  { label: "게시됨", value: "published" },
  { label: "임시저장", value: "draft" },
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function AdminReviewBoard({ initialReviews }: { initialReviews: AdminReviewRecord[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<MiniAppStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<AdminReviewRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesFilter = filter === "all" || review.status === filter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        review.appName.toLowerCase().includes(normalizedQuery) ||
        review.publisherName.toLowerCase().includes(normalizedQuery) ||
        review.publisherEmail.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query, reviews]);

  const metrics = useMemo(() => {
    const inReview = reviews.filter((review) => review.status === "in_review").length;
    const rejected = reviews.filter((review) => review.status === "rejected").length;
    const warnings = reviews.filter(
      (review) =>
        review.autoScanSummary.security === "warning" ||
        review.autoScanSummary.performance === "warning",
    ).length;

    return [
      {
        label: "심사 대기",
        value: inReview,
        icon: FileClock,
        tone: "text-gold",
        bg: "bg-gold/10",
      },
      {
        label: "반려 건",
        value: rejected,
        icon: ShieldAlert,
        tone: "text-destructive",
        bg: "bg-destructive/10",
      },
      {
        label: "자동 점검 경고",
        value: warnings,
        icon: AlertTriangle,
        tone: "text-union",
        bg: "bg-union/10",
      },
    ];
  }, [reviews]);

  const openDetail = (review: AdminReviewRecord) => {
    setSelectedReview(review);
    setDetailOpen(true);
  };

  const handleApprove = () => {
    if (!selectedReview) return;

    const nextReviewedAt = getToday();

    setReviews((current) =>
      current.map((review) =>
        review.id === selectedReview.id
          ? {
              ...review,
              status: "published",
              reviewedAt: nextReviewedAt,
              reviewerNote: "관리자 승인 완료",
              rejectionReasons: undefined,
            }
          : review,
      ),
    );

    setSelectedReview((current) =>
      current
        ? {
            ...current,
            status: "published",
            reviewedAt: nextReviewedAt,
            reviewerNote: "관리자 승인 완료",
            rejectionReasons: undefined,
          }
        : current,
    );

    toast.success("승인 처리되었습니다.", {
      description: `${selectedReview.appName} v${selectedReview.version}이 게시됨 상태로 변경되었습니다.`,
    });
  };

  const startReject = () => {
    setDetailOpen(false);
    setRejectReason(selectedReview?.rejectionReasons?.[0] ?? "");
    setRejectOpen(true);
  };

  const handleReject = () => {
    if (!selectedReview) return;

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      toast.error("반려 사유를 입력해주세요.");
      return;
    }

    const nextReviewedAt = getToday();

    setReviews((current) =>
      current.map((review) =>
        review.id === selectedReview.id
          ? {
              ...review,
              status: "rejected",
              reviewedAt: nextReviewedAt,
              reviewerNote: trimmedReason,
              rejectionReasons: [trimmedReason],
            }
          : review,
      ),
    );

    setSelectedReview((current) =>
      current
        ? {
            ...current,
            status: "rejected",
            reviewedAt: nextReviewedAt,
            reviewerNote: trimmedReason,
            rejectionReasons: [trimmedReason],
          }
        : current,
    );

    setRejectOpen(false);
    setRejectReason("");

    toast.success("반려 처리되었습니다.", {
      description: `${selectedReview.appName}에 반려 사유가 기록되었습니다.`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric, index) => (
            <Card key={metric.label} className={`card-hover animate-fade-up delay-${index + 1} border-border/60`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="heading-display mt-2 text-3xl">{metric.value}</p>
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
                제출된 앱을 검토하고 승인 또는 반려를 처리합니다.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[320px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="앱명, 퍼블리셔명, 이메일 검색"
                  className="h-10 border-border/60 bg-muted/20 pl-9"
                />
              </div>
              <Tabs value={filter} onValueChange={(value) => setFilter(value as MiniAppStatus | "all")}>
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
            {filteredReviews.length === 0 ? (
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
                    <TableHead>상태</TableHead>
                    <TableHead>자동 점검</TableHead>
                    <TableHead>제출일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => {
                    const hasWarning =
                      review.autoScanSummary.security === "warning" ||
                      review.autoScanSummary.performance === "warning";

                    return (
                      <TableRow
                        key={review.id}
                        className="cursor-pointer border-border/50"
                        onClick={() => openDetail(review)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openDetail(review);
                          }
                        }}
                        tabIndex={0}
                      >
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{review.appName}</p>
                              <Badge variant="outline" className="border-border/60 bg-background">
                                {CATEGORY_LABELS[review.category]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{review.shortDescription}</p>
                            <p className="text-xs font-mono text-muted-foreground/70">v{review.version}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{review.publisherName}</p>
                            <p className="text-xs text-muted-foreground">{review.publisherEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={review.status} />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              hasWarning
                                ? "border-gold/30 bg-gold/10 text-gold"
                                : "border-sage/30 bg-sage/10 text-sage"
                            }
                          >
                            {hasWarning ? "경고 있음" : "정상"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p>{review.submittedAt}</p>
                            {review.reviewedAt ? (
                              <p className="text-xs text-muted-foreground">검토: {review.reviewedAt}</p>
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
        onOpenChange={setDetailOpen}
        onApprove={handleApprove}
        onStartReject={startReject}
      />

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="heading-display text-lg">반려 사유 작성</DialogTitle>
            <DialogDescription>
              {selectedReview?.appName} v{selectedReview?.version} 반려 사유를 기록합니다.
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
            <Button variant="destructive" onClick={handleReject}>
              반려 확정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
