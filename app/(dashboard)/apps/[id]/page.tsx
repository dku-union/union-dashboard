"use client";

import { use } from "react";
import { useMiniAppDetail, useAppVersions } from "@/hooks/use-app-versions";
import { MiniAppStatusBadge } from "@/components/apps/mini-app-status-badge";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AppWindow, History, Upload } from "lucide-react";
import Link from "next/link";

export default function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const numId = Number(id);
  const { app, isLoading: appLoading } = useMiniAppDetail(numId);
  const { versions, isLoading: versionsLoading } = useAppVersions(numId);

  if (appLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

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
      {/* 상단 헤더 */}
      <div className="flex items-start justify-between animate-fade-up">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 border border-border/40">
            <AppWindow className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="heading-display text-2xl tracking-tight">{app.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {app.description || "설명 없음"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <MiniAppStatusBadge status={app.status} />
              <span className="text-xs text-muted-foreground">
                {app.workspaceName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border/60" render={<Link href={`/apps/${id}/versions`} />}>
            <History className="mr-1 h-4 w-4" />
            버전 이력
          </Button>
          <Button size="sm" className="bg-union text-white hover:bg-union/90" render={<Link href={`/workspace/${app.workspaceId}/upload`} />}>
            <Upload className="mr-1 h-4 w-4" />
            새 버전 업로드
          </Button>
        </div>
      </div>

      {/* 기본 정보 카드 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-up delay-1 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">워크스페이스</p>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: app.workspaceColor }}
                />
                <p className="text-sm font-medium">{app.workspaceName}</p>
              </div>
            </div>
            <Separator className="bg-border/60" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">설명</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {app.description || "설명 없음"}
              </p>
            </div>
            <Separator className="bg-border/60" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">등록일</p>
                <p className="text-sm font-mono">{new Date(app.createdAt).toLocaleDateString("ko-KR")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">최종 수정일</p>
                <p className="text-sm font-mono">{new Date(app.updatedAt).toLocaleDateString("ko-KR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 버전 이력 */}
        <Card className="animate-fade-up delay-2 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">최근 버전</CardTitle>
          </CardHeader>
          <CardContent>
            {versionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : versions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                등록된 버전이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {versions.slice(0, 5).map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium">v{v.versionNumber}</span>
                      <VersionStatusBadge status={v.status} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(v.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                ))}
                {versions.length > 5 && (
                  <Link
                    href={`/apps/${id}/versions`}
                    className="block text-center text-xs text-union hover:underline pt-2"
                  >
                    전체 {versions.length}개 버전 보기
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
