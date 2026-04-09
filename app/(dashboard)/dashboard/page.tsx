"use client";

import Link from "next/link";
import {
  AppWindow,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Plus,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { StatusBadge } from "@/components/apps/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMiniApps } from "@/data/mini-apps";
import { mockReviews } from "@/data/reviews";

export default function DashboardHome() {
  const { user } = useAuth();

  const publishedCount = mockMiniApps.filter((app) => app.status === "published").length;
  const inReviewCount = mockMiniApps.filter((app) => app.status === "in_review").length;
  const totalApps = mockMiniApps.length;
  const pendingReviews = mockReviews.filter(
    (review) => review.status === "in_review" || review.status === "rejected"
  ).length;

  const stats = [
    {
      label: "전체 앱",
      value: totalApps,
      icon: AppWindow,
      color: "text-foreground",
      bg: "bg-gradient-to-br from-foreground/5 to-foreground/[0.02]",
    },
    {
      label: "게시됨",
      value: publishedCount,
      icon: AppWindow,
      color: "text-sage",
      bg: "bg-gradient-to-br from-sage/10 to-sage/5",
    },
    {
      label: "심사 중",
      value: inReviewCount,
      icon: ClipboardCheck,
      color: "text-gold",
      bg: "bg-gradient-to-br from-gold/10 to-gold/5",
    },
    {
      label: "처리 필요",
      value: pendingReviews,
      icon: BarChart3,
      color: "text-union",
      bg: "bg-gradient-to-br from-union/10 to-union/5",
    },
  ];

  const quickActions = [
    {
      href: "/apps/new",
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

  return (
    <div className="max-w-6xl space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-heading-1">
          안녕하세요, <span className="union-underline">{user?.name}</span>님
        </h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Union Publisher Dashboard에 오신 것을 환영합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className={`card-hover animate-fade-up delay-${index + 1} border-border/60`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 text-caption uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-heading-2">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-label uppercase tracking-wider text-muted-foreground">
            빠른 작업
          </h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Card key={action.href} className="card-hover accent-line overflow-hidden border-border/60">
                <Button
                  variant="ghost"
                  className="group h-auto w-full justify-start p-4 text-left"
                  render={<Link href={action.href} />}
                >
                  <div className="flex w-full items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-union/10">
                      <action.icon className="h-4 w-4 text-union" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <Card className="animate-fade-up delay-6 border-border/60 lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-label uppercase tracking-wider text-muted-foreground">
                최근 심사 현황
              </CardTitle>
              <div className="h-0.5 w-6 bg-union" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {mockReviews.slice(0, 5).map((review, index) => (
                <div
                  key={review.id}
                  className={`animate-fade-up delay-${index + 1} flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <AppWindow className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{review.appName}</p>
                      <p className="text-xs text-muted-foreground">v{review.version}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={review.status} />
                    <span className="hidden text-xs text-muted-foreground/60 sm:block">
                      {review.submittedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
