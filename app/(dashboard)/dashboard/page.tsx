"use client";

import Link from "next/link";
import {
  AlertTriangle,
  AppWindow,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Plus,
  Rocket,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyMiniApps, useMyReviews } from "@/hooks/use-app-versions";
import type { Verdict } from "@/types/app-version";

const VERDICT_META: Record<
  Verdict,
  { label: string; icon: typeof Clock3; dot: string; bg: string }
> = {
  PENDING: {
    label: "심사 중",
    icon: Clock3,
    dot: "bg-gold",
    bg: "bg-gold/10 text-gold",
  },
  ACCEPTED: {
    label: "승인됨",
    icon: CheckCircle2,
    dot: "bg-sage",
    bg: "bg-sage/10 text-sage",
  },
  REJECTED: {
    label: "반려됨",
    icon: AlertTriangle,
    dot: "bg-destructive",
    bg: "bg-destructive/10 text-destructive",
  },
};

export default function DashboardHome() {
  const { user } = useAuth();
  const { apps, isLoading: appsLoading } = useMyMiniApps();
  const { reviews, isLoading: reviewsLoading } = useMyReviews();

  const totalApps = apps.length;
  const approvedAppCount = apps.filter((app) => app.status === "APPROVED").length;
  const pendingReviewCount = reviews.filter((review) => review.verdict === "PENDING").length;
  const rejectedReviewCount = reviews.filter((review) => review.verdict === "REJECTED").length;

  const stats = [
    {
      label: "전체 앱",
      value: totalApps,
      icon: AppWindow,
      caption: "운영 중인 포트폴리오",
      color: "text-foreground",
      bg: "bg-foreground/[0.04]",
    },
    {
      label: "승인된 앱",
      value: approvedAppCount,
      icon: AppWindow,
      caption: "슈퍼앱 배포 가능 상태",
      color: "text-sage",
      bg: "bg-sage/10",
    },
    {
      label: "심사 대기",
      value: pendingReviewCount,
      icon: ClipboardCheck,
      caption: "검토 대기 또는 진행",
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      label: "처리 필요",
      value: rejectedReviewCount,
      icon: Clock3,
      caption: "반려 항목 — 수정 필요",
      color: "text-union",
      bg: "bg-union/10",
    },
  ];

  const quickActions = [
    {
      href: "/workspace",
      icon: Plus,
      label: "미니앱 등록",
      description: "새로운 앱을 등록하고 첫 번째 릴리즈를 준비하세요.",
    },
    {
      href: "/workspace",
      icon: Users,
      label: "워크스페이스",
      description: "팀원을 관리하고 퍼블리셔 리소스를 공유하세요.",
    },
    {
      href: "/docs",
      icon: BookOpen,
      label: "문서 보기",
      description: "개발 가이드와 심사 제출 안내를 확인하세요.",
    },
  ];

  const recentReviews = reviews.slice(0, 5);
  const recentLoading = reviewsLoading && reviews.length === 0;

  return (
    <div className="publisher-page">
      <div className="publisher-page-header animate-fade-up">
        <div className="max-w-2xl">
          <p className="publisher-eyebrow">Publisher Overview</p>
          <h1 className="mt-2 text-heading-1">
            {user?.name}님의 미니앱 운영 현황
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            심사 요청, 테스트, 배포까지 퍼블리셔가 오늘 처리해야 할 항목을 우선순위대로 확인하세요.
          </p>
        </div>
        <Button className="bg-union text-white hover:bg-union/90" render={<Link href="/workspace" />}>
          <Plus className="h-4 w-4" />
          미니앱 등록
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className={`publisher-panel animate-fade-up delay-${index + 1}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="publisher-eyebrow">{stat.label}</p>
                  {appsLoading || reviewsLoading ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-2 text-2xl font-semibold tabular-nums">{stat.value}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{stat.caption}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="publisher-panel animate-fade-up delay-5">
          <CardHeader className="pb-1">
            <CardTitle className="publisher-eyebrow">Next Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={`${action.href}-${action.label}`}
                variant="ghost"
                className="publisher-row group h-auto w-full justify-start p-3 text-left"
                render={<Link href={action.href} />}
              >
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-union/10">
                    <action.icon className="h-4 w-4 text-union" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{action.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="publisher-panel animate-fade-up delay-6">
          <CardHeader className="pb-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="publisher-eyebrow">Review Queue</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">최근 제출과 심사 결과를 빠르게 확인합니다.</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/70" render={<Link href="/reviews" />}>
                전체 보기
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : recentReviews.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title="아직 심사 요청이 없습니다"
                description="미니앱 업로드 후 테스트를 거쳐 심사를 요청해보세요."
                action={{ label: "미니앱 업로드로 이동", href: "/workspace" }}
                variant="bare"
              />
            ) : (
              <div className="space-y-1">
                {recentReviews.map((review, index) => {
                  const meta = VERDICT_META[review.verdict];
                  const Icon = meta.icon;
                  const submittedLabel = new Date(review.submittedAt).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={review.id}
                      className={`publisher-row animate-fade-up delay-${index + 1} flex items-center justify-between gap-4 p-3`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/70">
                          <Icon className={`h-4 w-4 ${meta.bg.split(" ").find((c) => c.startsWith("text-")) ?? "text-muted-foreground"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{review.miniAppName}</p>
                          <p className="text-xs text-muted-foreground">v{review.versionNumber}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={`gap-1.5 font-medium text-[11px] ${meta.bg}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </Badge>
                        <span className="hidden min-w-20 text-right text-xs text-muted-foreground/70 sm:block">
                          {submittedLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="publisher-panel animate-fade-up delay-7">
        <CardContent className="grid gap-4 p-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-sage/10">
              <CheckCircle2 className="h-4 w-4 text-sage" />
            </div>
            <div>
              <p className="text-sm font-semibold">테스트 완료</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">QR 테스트가 끝난 빌드만 심사 요청이 가능합니다.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
              <ClipboardCheck className="h-4 w-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold">심사 진행</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">반려 사유는 상세 화면에서 바로 수정 업로드로 이어집니다.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-union/10">
              <Rocket className="h-4 w-4 text-union" />
            </div>
            <div>
              <p className="text-sm font-semibold">승인 후 배포</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">승인된 버전을 선택해 슈퍼앱에 릴리즈합니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
