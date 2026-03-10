"use client";

import { use } from "react";
import { mockMiniApps } from "@/data/mini-apps";
import { CATEGORY_LABELS, PERMISSION_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/apps/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppWindow, Edit, History, BarChart3 } from "lucide-react";
import Link from "next/link";
import { PermissionScope } from "@/types/mini-app";

export default function AppDetailPage({
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-fade-up">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-union/10 to-union/5 border border-union/10">
            <AppWindow className="h-8 w-8 text-union/70" />
          </div>
          <div>
            <h1 className="heading-display text-2xl tracking-tight">{app.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{app.shortDescription}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={app.status} />
              <span className="text-xs text-muted-foreground font-mono">v{app.currentVersion}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border/60" render={<Link href={`/apps/${id}/versions`} />}>
            <History className="mr-1 h-4 w-4" />
            버전 이력
          </Button>
          <Button variant="outline" size="sm" className="border-border/60" render={<Link href={`/apps/${id}/analytics`} />}>
            <BarChart3 className="mr-1 h-4 w-4" />
            분석
          </Button>
          <Button size="sm" className="bg-union text-white hover:bg-union/90">
            <Edit className="mr-1 h-4 w-4" />
            편집
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-up delay-1 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">카테고리</p>
              <p className="text-sm font-medium">{CATEGORY_LABELS[app.category]}</p>
            </div>
            <Separator className="bg-border/60" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">상세 설명</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{app.description}</p>
            </div>
            <Separator className="bg-border/60" />
            <div>
              <p className="text-xs text-muted-foreground mb-2">키워드</p>
              <div className="flex flex-wrap gap-1.5">
                {app.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-[11px] bg-muted/80">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-2 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">권한 및 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">요청 권한</p>
              <div className="space-y-1.5">
                {app.permissions.map((perm) => (
                  <div key={perm} className="flex items-center gap-2 text-sm">
                    <span className="h-1 w-1 rounded-full bg-union" />
                    {PERMISSION_LABELS[perm as PermissionScope]?.label || perm}
                  </div>
                ))}
              </div>
            </div>
            <Separator className="bg-border/60" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">등록일</p>
                <p className="text-sm font-mono">{app.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">최종 수정일</p>
                <p className="text-sm font-mono">{app.updatedAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
