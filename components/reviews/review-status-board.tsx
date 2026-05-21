"use client";

import { useMemo, useState } from "react";
import type { Review, Verdict } from "@/types/app-version";
import { ReviewCard } from "./review-card";
import { RejectionDetail } from "./rejection-detail";
import { ResubmitDialog } from "./resubmit-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, Clock3, FileCheck2, Search, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ReviewSort = "submitted_desc" | "submitted_asc" | "app_asc";
const sortOptions: { value: ReviewSort; label: string }[] = [
  { value: "submitted_desc", label: "최근 제출순" },
  { value: "submitted_asc", label: "오래된 순" },
  { value: "app_asc", label: "앱 이름순" },
];

const columns: { verdict: Verdict; title: string; dotColor: string }[] = [
  { verdict: "PENDING", title: "심사 대기", dotColor: "bg-gold" },
  { verdict: "ACCEPTED", title: "승인됨", dotColor: "bg-sage" },
  { verdict: "REJECTED", title: "반려됨", dotColor: "bg-destructive" },
];

interface ReviewStatusBoardProps {
  reviews: Review[];
  isLoading?: boolean;
  onUploadNewVersion?: (review: Review) => void;
}

export function ReviewStatusBoard({
  reviews,
  isLoading,
  onUploadNewVersion,
}: ReviewStatusBoardProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [rejectionOpen, setRejectionOpen] = useState(false);
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ReviewSort>("submitted_desc");

  const visibleReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? reviews.filter((review) =>
          [review.miniAppName, review.versionNumber, review.reason ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : reviews;
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "submitted_desc":
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case "submitted_asc":
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case "app_asc":
          return a.miniAppName.localeCompare(b.miniAppName, "ko");
        default:
          return 0;
      }
    });
  }, [reviews, query, sort]);

  const handleCardClick = (review: Review) => {
    if (review.verdict === "REJECTED") {
      setSelectedReview(review);
      setRejectionOpen(true);
    }
  };

  const handleResubmit = async () => {
    if (!selectedReview || !onUploadNewVersion) return;
    setResubmitOpen(false);
    onUploadNewVersion(selectedReview);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map(({ verdict }) => (
          <div key={verdict} className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="publisher-panel">
            <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-72">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="앱 이름, 버전, 사유 검색"
                  className="h-9 border-border/70 bg-card pl-8 text-sm"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as ReviewSort)}>
                <SelectTrigger className="h-9 w-full border-border/70 bg-card text-sm sm:w-40">
                  <SelectValue>
                    {() =>
                      sortOptions.find((option) => option.value === sort)?.label ?? "정렬"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
          {columns.map(({ verdict, title, dotColor }, colIdx) => {
            const columnReviews = visibleReviews.filter((r) => r.verdict === verdict);
            return (
              <div key={verdict} className={`publisher-panel animate-fade-up delay-${colIdx + 1} rounded-lg p-3`}>
                <div className="mb-3 flex items-center gap-2 border-b border-border/50 pb-3">
                  <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                  <h3 className="publisher-eyebrow text-foreground">{title}</h3>
                  <span className="ml-auto text-[11px] text-muted-foreground font-mono">
                    {columnReviews.length}
                  </span>
                </div>
                <div className="min-h-[100px] space-y-2">
                  {columnReviews.length === 0 ? (
                    <p className="text-caption text-muted-foreground/50 py-8 text-center">
                      항목 없음
                    </p>
                  ) : (
                    columnReviews.map((review) => (
                      <div key={review.id}>
                        <ReviewCard
                          review={review}
                          onClick={() => handleCardClick(review)}
                        />
                        {review.verdict === "REJECTED" && onUploadNewVersion && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-1 border-border/60 text-xs hover:border-union hover:text-union"
                            onClick={() => {
                              setSelectedReview(review);
                              setResubmitOpen(true);
                            }}
                          >
                            <Upload className="mr-1 h-3 w-3" />
                            새 버전 업로드
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="publisher-panel">
            <CardContent className="p-4">
              <p className="publisher-eyebrow">Review Guide</p>
              <div className="mt-4 space-y-3">
                <ReviewGuideItem
                  icon={Clock3}
                  title="대기"
                  description="제출된 버전은 검토 대기열에 들어갑니다."
                />
                <ReviewGuideItem
                  icon={CheckCircle2}
                  title="승인"
                  description="승인된 버전은 앱 상세에서 배포할 수 있습니다."
                />
                <ReviewGuideItem
                  icon={AlertTriangle}
                  title="반려"
                  description="반려 사유를 확인한 뒤 수정 버전을 업로드하세요."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="publisher-panel">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-union/10">
                  <FileCheck2 className="h-4 w-4 text-union" />
                </div>
                <div>
                  <p className="text-sm font-semibold">제출 전 확인</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    앱 설명, 버전 번호, 릴리즈 노트, 빌드 파일이 실제 변경 내용과 맞는지 확인하세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <RejectionDetail
        review={selectedReview}
        open={rejectionOpen}
        onOpenChange={setRejectionOpen}
        onUploadNewVersion={onUploadNewVersion}
      />
      <ResubmitDialog
        review={selectedReview}
        open={resubmitOpen}
        onOpenChange={setResubmitOpen}
        onConfirm={handleResubmit}
      />
    </>
  );
}

function ReviewGuideItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Clock3;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/40">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
