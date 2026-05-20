"use client";

import { use, useRef, useState } from "react";
import {
  useAppVersions,
  useDeployVersion,
  useMiniAppDetail,
  useMyReviews,
  useSubmitReview,
  useUploadMiniAppIcon,
} from "@/hooks/use-app-versions";
import { useWorkspace } from "@/hooks/use-workspaces";
import { MiniAppStatusBadge } from "@/components/apps/mini-app-status-badge";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import { VersionTestModal } from "@/components/apps/version-test-modal";
import { RejectionDetail } from "@/components/reviews/rejection-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  AppWindow,
  CalendarDays,
  CheckCircle,
  History,
  ImagePlus,
  Loader2,
  QrCode,
  Rocket,
  Send,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Review } from "@/types/app-version";

const POLL_INTERVAL = 15_000;

export default function AppDetailPage({
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
  const { workspace } = useWorkspace(app?.workspaceId ?? "");
  const { uploadIcon, step: iconStep } = useUploadMiniAppIcon();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const isUploadingIcon =
    iconStep === "url" || iconStep === "uploading" || iconStep === "saving";
  const canEditIcon =
    workspace?.myRole === "owner" ||
    workspace?.myRole === "admin" ||
    workspace?.myRole === "developer";

  const handleIconChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !app) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("PNG, JPG, WebP 형식만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("아이콘은 최대 2MB까지 업로드할 수 있습니다.");
      return;
    }
    const url = await uploadIcon(app.id, file);
    if (url) {
      toast.success("아이콘이 변경되었습니다.");
      refetchApp();
    }
  };

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
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/60 enabled:hover:border-union/40 disabled:cursor-default"
            disabled={!canEditIcon || isUploadingIcon}
            onClick={() => iconInputRef.current?.click()}
            title={canEditIcon ? "아이콘 변경" : undefined}
          >
            {app.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={app.iconUrl}
                alt={`${app.name} 아이콘`}
                className="h-full w-full object-cover"
              />
            ) : (
              <AppWindow className="h-8 w-8 text-muted-foreground" />
            )}
            {canEditIcon && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                {isUploadingIcon ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <ImagePlus className="h-5 w-5 text-white" />
                )}
              </div>
            )}
          </button>
          <input
            ref={iconInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleIconChange}
          />
          <div className="min-w-0">
            <p className="publisher-eyebrow">Mini App Detail</p>
            <h1 className="mt-1 truncate text-heading-1">{app.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {app.description || "설명 없음"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <MiniAppStatusBadge status={app.status} />
              <span className="text-xs text-muted-foreground">
                {app.workspaceName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {canEditIcon && (
            <Button
              variant="outline"
              size="sm"
              className="border-border/60"
              disabled={isUploadingIcon}
              onClick={() => iconInputRef.current?.click()}
            >
              {isUploadingIcon ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="mr-1 h-4 w-4" />
              )}
              {isUploadingIcon ? "아이콘 업로드 중..." : "아이콘 변경"}
            </Button>
          )}
          <Button variant="outline" size="sm" className="border-border/60" render={<Link href={`/apps/${id}/versions`} />}>
            <History className="mr-1 h-4 w-4" />
            버전 이력
          </Button>
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
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="publisher-panel animate-fade-up delay-1">
          <CardHeader>
            <CardTitle className="publisher-eyebrow">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/25 p-3">
                <p className="publisher-eyebrow">워크스페이스</p>
                <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: app.workspaceColor }}
                />
                <p className="text-sm font-medium">{app.workspaceName}</p>
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/25 p-3">
                <p className="publisher-eyebrow">앱 상태</p>
                <div className="mt-2">
                  <MiniAppStatusBadge status={app.status} />
                </div>
              </div>
            </div>
            <div>
              <p className="publisher-eyebrow mb-2">설명</p>
              <p className="text-sm leading-6 whitespace-pre-wrap">
                {app.description || "설명 없음"}
              </p>
            </div>
            <Separator className="bg-border/60" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="publisher-eyebrow mb-1">등록일</p>
                <p className="flex items-center gap-1.5 text-sm font-mono">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div>
                <p className="publisher-eyebrow mb-1">최종 수정일</p>
                <p className="flex items-center gap-1.5 text-sm font-mono">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  {new Date(app.updatedAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="publisher-panel animate-fade-up delay-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="publisher-eyebrow">최근 버전</CardTitle>
              <Button variant="outline" size="sm" className="border-border/70" render={<Link href={`/apps/${id}/versions`} />}>
                전체 보기
              </Button>
            </div>
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
                {versions.slice(0, 5).map((v) => {
                  const rejection = rejectedReviewByVersionId.get(v.id);

                  return (
                    <div key={v.id} className="publisher-row space-y-3 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-sm font-mono font-medium">v{v.versionNumber}</span>
                          <VersionStatusBadge status={v.status} />
                          {v.testedAt && (
                            <CheckCircle className="h-3 w-3 text-sage" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {v.status === "UPLOADED" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[11px] px-2 border-border/60"
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
                          <span className="text-xs text-muted-foreground">
                            {new Date(v.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
