"use client";

import { use, useState } from "react";
import {
  useDeployVersion,
  useMiniAppDetail,
  useAppVersions,
  useMyReviews,
  useSubmitReview,
} from "@/hooks/use-app-versions";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import { VersionTestModal } from "@/components/apps/version-test-modal";
import { RejectionDetail } from "@/components/reviews/rejection-detail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AppWindow, ArrowLeft, Upload, QrCode, CheckCircle, Rocket, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Review } from "@/types/app-version";

const POLL_INTERVAL = 15_000;

export default function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const numId = Number(id);
  const { app, isLoading: appLoading, refetch: refetchApp } = useMiniAppDetail(numId);
  const { versions, isLoading: versionsLoading, refetch: refetchVersions } = useAppVersions(numId, POLL_INTERVAL);
  const { submitReview, isSubmitting } = useSubmitReview();
  const { deployVersion, deployingVersionId } = useDeployVersion();
  const { reviews } = useMyReviews();

  const rejectedReviewByVersionId = new Map(
    reviews
      .filter((review) => review.verdict === "REJECTED")
      .map((review) => [review.versionId, review]),
  );

  const [testModalVersion, setTestModalVersion] = useState<{
    id: string;
    versionNumber: string;
  } | null>(null);
  const [selectedRejection, setSelectedRejection] = useState<Review | null>(null);
  const [rejectionOpen, setRejectionOpen] = useState(false);

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

  const latestVersion = versions[0];
  const latestRejection =
    latestVersion?.status === "REJECTED"
      ? rejectedReviewByVersionId.get(latestVersion.id)
      : undefined;
  const uploadHref = (versionNumber?: string) => {
    const params = new URLSearchParams({ miniAppId: String(app.id) });
    if (versionNumber) {
      params.set("rejectedVersion", versionNumber);
    }
    return `/workspace/${app.workspaceId}/upload?${params.toString()}`;
  };

  return (
    <div className="publisher-page">
      <div className="publisher-page-header animate-fade-up">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" render={<Link href={`/apps/${id}`} />}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <p className="publisher-eyebrow">Release History</p>
            <h1 className="mt-1 truncate text-heading-1">{app.name} 버전 이력</h1>
            <p className="mt-2 text-sm text-muted-foreground">{app.workspaceName}</p>
          </div>
        </div>
        <Button
          size="sm"
          className={
            latestRejection
              ? "bg-destructive text-white hover:bg-destructive/90"
              : "bg-union text-white hover:bg-union/90"
          }
          render={<Link href={uploadHref(latestRejection?.versionNumber)} />}
        >
          <Upload className="mr-1 h-4 w-4" />
          {latestRejection ? "수정 버전 업로드" : "새 버전 업로드"}
        </Button>
      </div>

      <Card className="publisher-panel animate-fade-up delay-1">
        <CardHeader>
          <CardTitle className="publisher-eyebrow">
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
            <div className="space-y-2">
              {versions.map((v) => {
                const rejection = rejectedReviewByVersionId.get(v.id);

                return (
                  <div key={v.id} className="publisher-row p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-mono font-semibold">v{v.versionNumber}</span>
                          <VersionStatusBadge status={v.status} />
                          {v.testedAt && (
                            <span className="flex items-center gap-1 text-[11px] text-sage">
                              <CheckCircle className="h-3 w-3" />
                              테스트 완료
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-mono">
                            {new Date(v.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                          {v.releaseNotes && (
                            <span className="max-w-[360px] truncate">{v.releaseNotes}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
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
                        {v.status === "ACCEPTED" && (
                          <Button
                            size="xs"
                            className="bg-union text-white hover:bg-union/90"
                            disabled={deployingVersionId === v.id}
                            onClick={async () => {
                              const result = await deployVersion(v.id);
                              if (result) {
                                refetchVersions();
                                refetchApp();
                              }
                            }}
                          >
                            <Rocket className="mr-1 h-3 w-3" />
                            배포
                          </Button>
                        )}
                        {v.status === "REJECTED" && rejection && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-destructive/30 text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setSelectedRejection(rejection);
                              setRejectionOpen(true);
                            }}
                          >
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            반려 사유
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
      <RejectionDetail
        review={selectedRejection}
        open={rejectionOpen}
        onOpenChange={setRejectionOpen}
        onUploadNewVersion={(review) => {
          router.push(uploadHref(review.versionNumber));
        }}
      />
    </div>
  );
}
