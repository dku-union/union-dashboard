"use client";

import { use } from "react";
import { mockMiniApps } from "@/data/mini-apps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, TrendingUp, TrendingDown, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";
import { AppWindow } from "lucide-react";

export default function AppAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const app = mockMiniApps.find((a) => a.id === id);

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
          <AppWindow className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="heading-display text-lg">앱을 찾을 수 없습니다</h2>
        <Button variant="outline" className="mt-4 border-border/60" render={<Link href="/apps" />}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const metrics = [
    {
      title: "일간 활성 사용자",
      value: "542",
      change: "+8.2%",
      trend: "up" as const,
      subtitle: "전주 대비",
      icon: Users,
    },
    {
      title: "평균 세션 시간",
      value: "4분 32초",
      change: "+12%",
      trend: "up" as const,
      subtitle: "전주 대비",
      icon: Clock,
    },
    {
      title: "전환율",
      value: "23.5%",
      change: "-1.3%",
      trend: "down" as const,
      subtitle: "전주 대비",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-fade-up">
        <Button variant="ghost" size="icon" render={<Link href={`/apps/${id}`} />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 border border-border/40">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="heading-display text-2xl tracking-tight">
              {app.name}
            </h1>
            <p className="text-sm text-muted-foreground">앱 분석</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className={`animate-fade-up delay-${i + 1} border-border/60 card-hover`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">{metric.title}</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="heading-display text-2xl">{metric.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={`text-xs font-medium ${metric.trend === "up" ? "text-muted-foreground" : "text-destructive"}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{metric.subtitle}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="animate-fade-up delay-4 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-base">상세 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            전체 분석 대시보드에서 더 자세한 통계를 확인하세요.
          </p>
          <Button variant="outline" className="mt-4 border-border/60" render={<Link href="/analytics" />}>
            <BarChart3 className="mr-1 h-4 w-4" />
            전체 분석 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
