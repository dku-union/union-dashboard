"use client";

import { use, useMemo, useState } from "react";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AppWindow, ArrowLeft, Upload, QrCode, CheckCircle, Rocket, Search, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Review, VersionStatus } from "@/types/app-version";

type VersionStatusFilter = VersionStatus | "all";
const statusFilterOptions: { value: VersionStatusFilter; label: string }[] = [
  { value: "all", label: "모든 상태" },
  { value: "DRAFT", label: "DRAFT" },
  { value: "UPLOADED", label: "UPLOADED" },
  { value: "IN_REVIEW", label: "IN_REVIEW" },
  { value: "ACCEPTED", label: "ACCEPTED" },
  { value: "REJECTED", label: "REJECTED" },
  { value: "DEPLOYED", label: "DEPLOYED" },
];

type VersionSort = "created_desc" | "created_asc" | "version_desc";
const sortOptions: { value: VersionSort; label: string }[] = [
  { value: "created_desc", label: "최근 생성순" },
  { value: "created_asc", label: "오래된 순" },
  { value: "version_desc", label: "버전 내림차순" },
];

function compareVersions(a: string, b: string) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const ai = pa[i] ?? 0;
    const bi = pb[i] ?? 0;
    if (ai !== bi) return ai - bi;
  }
  return 0;
}

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
  const [statusFilter, setStatusFilter] = useState<VersionStatusFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<VersionSort>("created_desc");

  const visibleVersions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = versions.filter((v) => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (!q) return true;
      return (
        v.versionNumber.toLowerCase().includes(q) ||
        (v.releaseNotes ?? "").toLowerCase().includes(q)
      );
    });
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "created_desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "created_asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "version_desc":
          return compareVersions(b.versionNumber, a.versionNumber);
        default:
          return 0;
      }
    });
  }, [versions, statusFilter, query, sort]);

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
      <EmptyState
        icon={AppWindow}
        title="앱을 찾을 수 없습니다"
        action={{ label: "목록으로 돌아가기", href: "/apps" }}
        className="animate-fade-up my-12"
      />
    );
  }

  const latestVersion = versions[0];
  const untestedVersion = versions.find((v) => v.status === "UPLOADED" && !v.testedAt);
  const reviewReadyVersion = versions.find((v) => v.status === "UPLOADED" && v.testedAt);
  const acceptedVersion = versions.find((v) => v.status === "ACCEPTED");
  const inReviewCount = versions.filter((v) => v.status === "IN_REVIEW").length;
  const deployedCount = versions.filter((v) => v.status === "DEPLOYED").length;
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
  const nextAction = getNextReleaseAction({
    hasVersions: versions.length > 0,
    latestRejected: !!latestRejection,
    hasUntested: !!untestedVersion,
    hasReviewReady: !!reviewReadyVersion,
    inReviewCount,
    hasAccepted: !!acceptedVersion,
    deployedCount,
  });

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
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div>
              <p className="publisher-eyebrow">Release Flow</p>
              <h2 className="mt-1 text-lg font-semibold">다음 출시 작업</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {nextAction.description}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-5">
                {[
                  { label: "업로드", active: versions.length > 0 },
                  { label: "QR 테스트", active: versions.some((v) => v.testedAt) },
                  { label: "심사", active: inReviewCount > 0 || versions.some((v) => v.status === "ACCEPTED" || v.status === "REJECTED" || v.status === "DEPLOYED") },
                  { label: "승인", active: versions.some((v) => v.status === "ACCEPTED" || v.status === "DEPLOYED") },
                  { label: "배포", active: deployedCount > 0 },
                ].map((step, index) => (
                  <div
                    key={step.label}
                    className={`rounded-md border px-3 py-2 text-xs ${
                      step.active
                        ? "border-union/30 bg-union/10 text-union"
                        : "border-border/60 bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <span className="font-mono text-[10px]">0{index + 1}</span>
                    <p className="mt-1 font-medium">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">{nextAction.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{nextAction.detail}</p>
              <Button
                size="sm"
                className="mt-4 w-full bg-union text-white hover:bg-union/90"
                variant={nextAction.variant}
                render={nextAction.href ? <Link href={nextAction.href} /> : undefined}
                onClick={nextAction.onClick}
                disabled={nextAction.disabled}
              >
                {nextAction.icon}
                {nextAction.label}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="publisher-panel animate-fade-up delay-1">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="publisher-eyebrow">
              전체 버전 ({versions.length})
            </CardTitle>
          </div>
          {versions.length > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as VersionStatusFilter)}
              >
                <SelectTrigger className="h-9 w-full border-border/70 bg-card text-sm sm:w-44">
                  <SelectValue>
                    {() =>
                      statusFilterOptions.find((o) => o.value === statusFilter)?.label ?? "상태"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:max-w-72">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="버전·릴리즈 노트 검색"
                    className="h-9 border-border/70 bg-card pl-8 text-sm"
                  />
                </div>
                <Select value={sort} onValueChange={(v) => setSort(v as VersionSort)}>
                  <SelectTrigger className="h-9 w-full border-border/70 bg-card text-sm sm:w-40">
                    <SelectValue>
                      {() => sortOptions.find((o) => o.value === sort)?.label ?? "정렬"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <EmptyState
              icon={AppWindow}
              title="등록된 버전이 없습니다"
              description="워크스페이스에서 빌드 파일을 업로드해 첫 버전을 등록해보세요."
              action={{
                label: "새 버전 업로드",
                href: `/workspace/${app.workspaceId}/upload?miniAppId=${app.id}`,
              }}
              variant="bare"
            />
          ) : visibleVersions.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              검색·필터 조건에 맞는 버전이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {visibleVersions.map((v) => {
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

  function getNextReleaseAction({
    hasVersions,
    latestRejected,
    hasUntested,
    hasReviewReady,
    inReviewCount,
    hasAccepted,
    deployedCount,
  }: {
    hasVersions: boolean;
    latestRejected: boolean;
    hasUntested: boolean;
    hasReviewReady: boolean;
    inReviewCount: number;
    hasAccepted: boolean;
    deployedCount: number;
  }) {
    if (!hasVersions) {
      return {
        title: "첫 버전 업로드 필요",
        description: "아직 등록된 버전이 없습니다. 빌드 파일을 올리면 테스트와 심사 요청을 진행할 수 있습니다.",
        detail: "앱 버전은 .unionapp 빌드와 버전 번호를 기준으로 관리됩니다.",
        label: "버전 업로드",
        href: uploadHref(),
        icon: <Upload className="mr-1 h-3.5 w-3.5" />,
        variant: "default" as const,
      };
    }
    if (latestRejected) {
      return {
        title: "반려 대응 필요",
        description: "최근 버전이 반려되었습니다. 반려 사유를 확인하고 수정 버전을 업로드해야 합니다.",
        detail: "반려된 버전 번호를 기준으로 다음 패치 버전이 자동 제안됩니다.",
        label: "수정 버전 업로드",
        href: uploadHref(latestRejection?.versionNumber),
        icon: <Upload className="mr-1 h-3.5 w-3.5" />,
        variant: "default" as const,
      };
    }
    if (hasUntested && untestedVersion) {
      return {
        title: "QR 테스트 필요",
        description: "업로드는 완료됐지만 아직 테스트 완료 이력이 없습니다. QR 테스트 후 심사 요청이 활성화됩니다.",
        detail: `v${untestedVersion.versionNumber} 테스트 링크를 발급하세요.`,
        label: "QR 테스트",
        onClick: () =>
          setTestModalVersion({
            id: untestedVersion.id,
            versionNumber: untestedVersion.versionNumber,
          }),
        icon: <QrCode className="mr-1 h-3.5 w-3.5" />,
        variant: "default" as const,
      };
    }
    if (hasReviewReady && reviewReadyVersion) {
      return {
        title: "심사 요청 가능",
        description: "테스트가 완료된 버전이 있습니다. 심사 요청을 보내면 관리자 검토 대기열로 이동합니다.",
        detail: `v${reviewReadyVersion.versionNumber} 버전을 심사 요청할 수 있습니다.`,
        label: isSubmitting ? "요청 중" : "심사 요청",
        onClick: async () => {
          const result = await submitReview(reviewReadyVersion.id);
          if (result) refetchVersions();
        },
        disabled: isSubmitting,
        icon: <Send className="mr-1 h-3.5 w-3.5" />,
        variant: "default" as const,
      };
    }
    if (inReviewCount > 0) {
      return {
        title: "심사 진행 중",
        description: "관리자 검토가 진행 중입니다. 승인되면 배포 버튼이 활성화됩니다.",
        detail: `${inReviewCount}개 버전이 심사 대기 또는 검토 중입니다.`,
        label: "심사 현황 보기",
        href: "/reviews",
        icon: <Send className="mr-1 h-3.5 w-3.5" />,
        variant: "default" as const,
      };
    }
    if (hasAccepted && acceptedVersion) {
      return {
        title: "배포 가능",
        description: "승인된 버전이 있습니다. 배포하면 슈퍼앱 사용자에게 공개됩니다.",
        detail: `v${acceptedVersion.versionNumber} 버전을 배포할 수 있습니다.`,
        label: deployingVersionId === acceptedVersion.id ? "배포 중" : "배포",
        onClick: async () => {
          const result = await deployVersion(acceptedVersion.id);
          if (result) {
            refetchVersions();
            refetchApp();
          }
        },
        disabled: deployingVersionId === acceptedVersion.id,
        icon: <Rocket className="mr-1 h-3.5 w-3.5" />,
        variant: "default" as const,
      };
    }
    return {
      title: deployedCount > 0 ? "운영 중" : "추가 버전 준비",
      description: deployedCount > 0
        ? "배포된 버전이 운영 중입니다. 변경 사항이 있으면 새 버전을 업로드하세요."
        : "현재 바로 처리할 출시 작업은 없습니다. 다음 변경 사항이 준비되면 새 버전을 업로드하세요.",
      detail: deployedCount > 0 ? `${deployedCount}개 버전이 배포 이력에 있습니다.` : "버전 이력에서 기존 제출 내역을 확인할 수 있습니다.",
      label: "새 버전 업로드",
      href: uploadHref(),
      icon: <Upload className="mr-1 h-3.5 w-3.5" />,
      variant: "default" as const,
    };
  }
}
