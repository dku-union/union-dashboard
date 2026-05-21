"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppWindow, ClipboardCheck, Info, Users } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminDashboardData } from "@/types/admin";

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ko-KR");
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "대시보드 데이터를 불러오지 못했습니다.");
        }

        setDashboard(data);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "대시보드 데이터를 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboard();
  }, []);

  const stats = [
    {
      label: "총 사용자",
      value: dashboard?.stats.find((stat) => stat.label === "총 사용자")?.value ?? 0,
      icon: Users,
      color: "text-foreground",
      bg: "bg-gradient-to-br from-foreground/5 to-foreground/[0.02]",
    },
    {
      label: "전체 앱",
      value: dashboard?.stats.find((stat) => stat.label === "전체 앱")?.value ?? 0,
      icon: AppWindow,
      color: "text-sage",
      bg: "bg-gradient-to-br from-sage/10 to-sage/5",
    },
    {
      label: "심사 대기",
      value: dashboard?.stats.find((stat) => stat.label === "심사 대기")?.value ?? 0,
      icon: ClipboardCheck,
      color: "text-gold",
      bg: "bg-gradient-to-br from-gold/10 to-gold/5",
    },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div className="animate-fade-up">
        <h1 className="heading-display text-3xl tracking-tight">관리자 대시보드</h1>
        <p className="mt-1 text-muted-foreground">
          안녕하세요, {user?.name ?? "관리자"}님. Union 플랫폼 운영 현황입니다.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-start gap-3 p-6">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              다시 시도
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className={`card-hover animate-fade-up delay-${index + 1} border-border/60`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <p className="heading-display text-3xl">{stat.value}</p>
                  )}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <Card className="animate-fade-up delay-4 border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              최근 심사 요청
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {isLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : dashboard?.recentReviews.length ? (
              dashboard.recentReviews.map((review) => (
                <div key={review.versionId} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                  <p className="text-sm font-medium">{review.miniAppName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{review.publisherName ?? "-"}</p>
                  <p className="mt-1 text-xs font-mono text-muted-foreground/70">
                    v{review.versionNumber} · {formatDate(review.submittedAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">심사 대기 중인 버전이 없습니다.</p>
            )}
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/apps" />}>
              심사 보드 보기
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-5 border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              최근 반려 건
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {isLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : dashboard?.rejectedReviews.length ? (
              dashboard.rejectedReviews.map((review) => (
                <div key={review.versionId} className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-3">
                  <p className="text-sm font-medium">{review.miniAppName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{review.reviewReason ?? "반려 사유 없음"}</p>
                  <p className="mt-1 text-xs font-mono text-muted-foreground/70">
                    검토일 {formatDate(review.reviewedAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">최근 반려 내역이 없습니다.</p>
            )}
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/apps" />}>
              반려 이력 보기
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-6 border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              주의 필요 퍼블리셔
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {isLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : dashboard?.attentionPublishers.length ? (
              dashboard.attentionPublishers.map((publisher) => (
                <div key={publisher.id} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                  <p className="text-sm font-medium">{publisher.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{publisher.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    상태 {publisher.status} · 심사 중 {publisher.inReviewAppCount}건
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">주의가 필요한 퍼블리셔가 없습니다.</p>
            )}
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/publishers" />}>
              퍼블리셔 관리
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-7 border-dashed border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              신고 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4 text-muted-foreground" />
                실데이터 모델 준비 중
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                신고 도메인은 별도 영속 모델 설계 후 연결할 예정입니다.
              </p>
            </div>
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/reports" />}>
              준비 상태 보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
