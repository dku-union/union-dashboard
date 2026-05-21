"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, AppWindow, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useMiniAppDetail } from "@/hooks/use-app-versions";

export default function AppAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const numericId = Number(id);
  const { app, isLoading } = useMiniAppDetail(Number.isFinite(numericId) ? numericId : null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!app) {
    return (
      <EmptyState
        icon={AppWindow}
        title="앱을 찾을 수 없습니다"
        action={{ label: "목록으로 돌아가기", href: "/apps" }}
        className="animate-fade-up my-12"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-fade-up">
        <Button variant="ghost" size="icon" render={<Link href={`/apps/${id}`} />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-muted/60 border border-border/40">
            {app.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={app.iconUrl} alt={`${app.name} 아이콘`} className="h-full w-full object-cover" />
            ) : (
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="heading-display text-2xl tracking-tight">{app.name}</h1>
            <p className="text-sm text-muted-foreground">앱 분석</p>
          </div>
        </div>
      </div>

      <Card className="animate-fade-up delay-1 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-base">통계 대시보드로 이동</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            이 미니앱의 실행 추이·활성 사용자·세션 같은 상세 지표는 전체 분석 페이지에서 미니앱 필터로
            조회할 수 있습니다.
          </p>
          <Button
            variant="outline"
            className="border-border/60"
            render={<Link href={`/analytics?miniAppId=${app.id}`} />}
          >
            <BarChart3 className="mr-1 h-4 w-4" />
            전체 분석 페이지에서 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
