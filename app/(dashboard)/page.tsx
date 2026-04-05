"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppWindow, ClipboardCheck, BarChart3, Plus, ArrowUpRight, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { mockMiniApps } from "@/data/mini-apps";
import { mockReviews } from "@/data/reviews";
import { StatusBadge } from "@/components/apps/status-badge";

export default function DashboardHome() {
  const { user } = useAuth();

  const publishedCount = mockMiniApps.filter((a) => a.status === "published").length;
  const inReviewCount = mockMiniApps.filter((a) => a.status === "in_review").length;
  const totalApps = mockMiniApps.length;
  const pendingReviews = mockReviews.filter(
    (r) => r.status === "in_review" || r.status === "rejected"
  ).length;

  const stats = [
    { label: "전체 앱", value: totalApps, icon: AppWindow, color: "text-foreground", bg: "bg-gradient-to-br from-foreground/5 to-foreground/[0.02]" },
    { label: "게시됨", value: publishedCount, icon: AppWindow, color: "text-sage", bg: "bg-gradient-to-br from-sage/10 to-sage/5" },
    { label: "심사 중", value: inReviewCount, icon: ClipboardCheck, color: "text-gold", bg: "bg-gradient-to-br from-gold/10 to-gold/5" },
    { label: "처리 필요", value: pendingReviews, icon: BarChart3, color: "text-union", bg: "bg-gradient-to-br from-union/10 to-union/5" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div className="animate-fade-up">
        <h1 className="heading-display text-3xl tracking-tight">
          안녕하세요, <span className="union-underline">{user?.name}</span>님
        </h1>
        <p className="text-muted-foreground mt-1">
          Union Publisher Dashboard에 오신 것을 환영합니다.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} className={`card-hover animate-fade-up delay-${i + 1} border-border/60`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {stat.label}
                  </p>
                  <p className="heading-display text-3xl">{stat.value}</p>
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
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-3 animate-fade-up delay-5">
          <h2 className="heading-display text-sm uppercase tracking-wider text-muted-foreground">빠른 시작</h2>
          <div className="space-y-2">
            {[
              { href: "/apps/new", icon: Plus, label: "새 미니앱 등록", desc: "새로운 미니앱을 등록하세요" },
              { href: "/workspace", icon: Users, label: "워크스페이스", desc: "팀원들과 함께 관리하세요" },
              { href: "/docs", icon: BookOpen, label: "개발 문서", desc: "API 레퍼런스를 확인하세요" },
            ].map((action) => (
              <Card key={action.href} className="card-hover accent-line overflow-hidden border-border/60">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-4 justify-start text-left group"
                  render={<Link href={action.href} />}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-union/10 shrink-0">
                      <action.icon className="h-4 w-4 text-union" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 animate-fade-up delay-6 border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                최근 활동
              </CardTitle>
              <div className="h-0.5 w-6 bg-union" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {mockReviews.slice(0, 5).map((review, i) => (
                <div
                  key={review.id}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-up delay-${i + 1}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                      <AppWindow className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{review.appName}</p>
                      <p className="text-xs text-muted-foreground">v{review.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={review.status} />
                    <span className="text-xs text-muted-foreground/60 hidden sm:block">
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
