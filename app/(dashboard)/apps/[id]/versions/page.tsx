"use client";

import { use, useState } from "react";
import { useMiniAppDetail, useAppVersions, useSubmitReview } from "@/hooks/use-app-versions";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import { VersionTestModal } from "@/components/apps/version-test-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppWindow, ArrowLeft, Upload, QrCode, CheckCircle, Send } from "lucide-react";
import Link from "next/link";

const POLL_INTERVAL = 15_000;

export default function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const numId = Number(id);
  const { app, isLoading: appLoading } = useMiniAppDetail(numId);
  const { versions, isLoading: versionsLoading, refetch: refetchVersions } = useAppVersions(numId, POLL_INTERVAL);
  const { submitReview, isSubmitting } = useSubmitReview();

  const [testModalVersion, setTestModalVersion] = useState<{
    id: string;
    versionNumber: string;
  } | null>(null);

  const isLoading = appLoading || versionsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
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
      <div className="flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" render={<Link href={`/apps/${id}`} />}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="heading-display text-2xl tracking-tight">{app.name} - 버전 이력</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{app.workspaceName}</p>
          </div>
        </div>
        <Button size="sm" className="bg-union text-white hover:bg-union/90" render={<Link href={`/workspace/${app.workspaceId}/upload`} />}>
          <Upload className="mr-1 h-4 w-4" />
          새 버전 업로드
        </Button>
      </div>

      <Card className="animate-fade-up delay-1 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
            전체 버전 ({versions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 mb-3">
                <AppWindow className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">등록된 버전이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {versions.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-semibold">v{v.versionNumber}</span>
                    <VersionStatusBadge status={v.status} />
                    {v.testedAt && (
                      <span className="flex items-center gap-1 text-[11px] text-sage">
                        <CheckCircle className="h-3 w-3" />
                        테스트 완료
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {v.status === "UPLOADED" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-border/60"
                          onClick={() =>
                            setTestModalVersion({
                              id: v.id,
                              versionNumber: v.versionNumber,
                            })
                          }
                        >
                          <QrCode className="mr-1 h-3 w-3" />
                          테스트
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-union/30 text-union hover:bg-union/10"
                          disabled={!v.testedAt || isSubmitting}
                          title={!v.testedAt ? "테스트 완료 후 활성화됩니다" : undefined}
                          onClick={async () => {
                            const result = await submitReview(v.id);
                            if (result) refetchVersions();
                          }}
                        >
                          <Send className="mr-1 h-3 w-3" />
                          심사 요청
                        </Button>
                      </>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {v.releaseNotes && (
                        <span className="max-w-[200px] truncate">{v.releaseNotes}</span>
                      )}
                      <span className="font-mono">
                        {new Date(v.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {testModalVersion && (
        <VersionTestModal
          versionId={testModalVersion.id}
          versionNumber={testModalVersion.versionNumber}
          open={!!testModalVersion}
          onOpenChange={(open) => {
            if (!open) setTestModalVersion(null);
          }}
        />
      )}
    </div>
  );
}
