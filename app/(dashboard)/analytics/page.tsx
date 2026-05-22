"use client";

import { useMemo, useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { MetricCard } from "@/components/analytics/metric-card";
import { LineChartCard } from "@/components/analytics/line-chart-card";
import { BarChartCard } from "@/components/analytics/bar-chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AnalyticsRange } from "@/types/analytics";
import { AppWindow, MousePointerClick, PackageCheck, Users } from "lucide-react";

const rangeOptions: { value: AnalyticsRange; label: string }[] = [
  { value: "today", label: "오늘" },
  { value: "last_7_days", label: "최근 7일" },
  { value: "last_30_days", label: "최근 30일" },
  { value: "this_month", label: "이번 달" },
  { value: "all", label: "전체 기간" },
];

export default function AnalyticsPage() {
  const { workspaces, isLoading: isWorkspaceLoading } = useWorkspaces();
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [miniAppId, setMiniAppId] = useState<number | "all">("all");
  const [range, setRange] = useState<AnalyticsRange>("last_30_days");
  const selectedWorkspaceId = workspaceId || workspaces[0]?.id || "";
  const { data, isLoading } = useAnalytics({ workspaceId: selectedWorkspaceId, miniAppId, range });

  const selectedWorkspaceName = useMemo(() => {
    return workspaces.find((workspace) => workspace.id === selectedWorkspaceId)?.name || "워크스페이스";
  }, [selectedWorkspaceId, workspaces]);

  if (isWorkspaceLoading || (selectedWorkspaceId && isLoading && !data)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-heading-1">분석</h1>
          <p className="text-body-sm text-muted-foreground mt-1">미니앱 사용 기록 기반 통계</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-heading-1">분석</h1>
          <p className="text-body-sm text-muted-foreground mt-1">미니앱 사용 기록 기반 통계</p>
        </div>
        <EmptyState
          icon={AppWindow}
          title="조회할 워크스페이스가 없습니다"
          description="워크스페이스에 참여하면 사용 통계를 확인할 수 있습니다."
          action={{ label: "워크스페이스 만들기", href: "/workspace/new" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 animate-fade-up lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-heading-1">분석</h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            {selectedWorkspaceName}의 미니앱 사용 기록 기반 통계
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedWorkspaceId}
            onValueChange={(value) => {
              if (!value) return;
              setWorkspaceId(value);
              setMiniAppId("all");
            }}
          >
            <SelectTrigger className="min-w-48">
              <SelectValue>
                {() =>
                  workspaces.find((workspace) => workspace.id === selectedWorkspaceId)
                    ?.name ?? "워크스페이스 선택"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(miniAppId)}
            onValueChange={(value) => {
              if (!value) return;
              setMiniAppId(value === "all" ? "all" : Number(value));
            }}
          >
            <SelectTrigger className="min-w-44">
              <SelectValue>
                {() => {
                  if (miniAppId === "all") return "전체 미니앱";
                  return (
                    data?.apps.find((app) => app.id === miniAppId)?.name ??
                    "전체 미니앱"
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 미니앱</SelectItem>
              {data?.apps.map((app) => (
                <SelectItem key={app.id} value={String(app.id)}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={range}
            onValueChange={(value) => {
              if (!value) return;
              setRange(value as AnalyticsRange);
            }}
          >
            <SelectTrigger className="min-w-36">
              <SelectValue>
                {() =>
                  rangeOptions.find((option) => option.value === range)?.label ??
                  "기간"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {rangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="animate-fade-up delay-1">
          <MetricCard
            title="실행 수"
            subtitle="선택 기간 전체"
            data={data?.overview.totalLaunches ?? { value: 0, change: 0, trend: "neutral" }}
            icon={<MousePointerClick className="h-5 w-5 text-muted-foreground" />}
          />
        </div>
        <div className="animate-fade-up delay-2">
          <MetricCard
            title="활성 사용자"
            subtitle="고유 사용자"
            data={data?.overview.activeUsers ?? { value: 0, change: 0, trend: "neutral" }}
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
          />
        </div>
        <div className="animate-fade-up delay-3">
          <MetricCard
            title="사용된 미니앱"
            subtitle="실행 기록 기준"
            data={data?.overview.usedMiniApps ?? { value: 0, change: 0, trend: "neutral" }}
            icon={<PackageCheck className="h-5 w-5 text-muted-foreground" />}
          />
        </div>
      </div>

      <div className="animate-fade-up delay-4">
        <LineChartCard title="일별 실행 추세" data={data?.dailyTrend ?? []} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="animate-fade-up delay-5">
          <BarChartCard
            title="미니앱별 실행 수"
            data={(data?.appBreakdown ?? []).map((app) => ({ name: app.name, value: app.launches }))}
            color="var(--gold)"
          />
        </div>
        <Card className="animate-fade-up delay-6 border-border/60">
          <CardHeader>
            <CardTitle className="text-label uppercase tracking-wider text-muted-foreground">
              미니앱별 상세
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>미니앱</TableHead>
                  <TableHead className="text-right">실행</TableHead>
                  <TableHead className="text-right">사용자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.appBreakdown ?? []).map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell className="text-right">{app.launches.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{app.activeUsers.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {data?.appBreakdown.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      선택한 조건에 해당하는 사용 기록이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
