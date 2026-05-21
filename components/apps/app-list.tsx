"use client";

import { useMemo, useState } from "react";
import type { MiniAppWithWorkspace, MiniAppStatus } from "@/types/app-version";
import { AppCard } from "./app-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppWindow, CheckCircle2, Clock3, LayoutGrid, Search, Upload, Workflow } from "lucide-react";
import Link from "next/link";

const statusFilters: { label: string; value: MiniAppStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "대기 중", value: "PENDING" },
  { label: "승인됨", value: "APPROVED" },
];

type SortMode = "updated_desc" | "name_asc" | "workspace_asc" | "status_asc";
const sortOptions: { value: SortMode; label: string }[] = [
  { value: "updated_desc", label: "최근 수정순" },
  { value: "name_asc", label: "이름 가나다순" },
  { value: "workspace_asc", label: "워크스페이스순" },
  { value: "status_asc", label: "상태순" },
];

interface AppListProps {
  apps: MiniAppWithWorkspace[];
  isLoading: boolean;
}

export function AppList({ apps, isLoading }: AppListProps) {
  const [filter, setFilter] = useState<MiniAppStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("updated_desc");

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const base = (filter === "all" ? apps : apps.filter((a) => a.status === filter)).filter(
      (app) => {
        if (!normalizedQuery) return true;
        return [app.name, app.description ?? "", app.workspaceName]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      },
    );
    return [...base].sort((a, b) => {
      switch (sort) {
        case "updated_desc":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "name_asc":
          return a.name.localeCompare(b.name, "ko");
        case "workspace_asc": {
          const ws = a.workspaceName.localeCompare(b.workspaceName, "ko");
          return ws !== 0 ? ws : a.name.localeCompare(b.name, "ko");
        }
        case "status_asc": {
          const order: Record<MiniAppStatus, number> = { PENDING: 0, APPROVED: 1 };
          return order[a.status] - order[b.status];
        }
        default:
          return 0;
      }
    });
  }, [apps, filter, query, sort]);
  const pendingCount = apps.filter((a) => a.status === "PENDING").length;
  const approvedCount = apps.filter((a) => a.status === "APPROVED").length;
  const recentApp = [...apps].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="publisher-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="publisher-eyebrow">전체</p>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{apps.length}</p>
        </div>
        <div className="publisher-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="publisher-eyebrow">대기 중</p>
            <Clock3 className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{pendingCount}</p>
        </div>
        <div className="publisher-panel rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="publisher-eyebrow">승인됨</p>
            <CheckCircle2 className="h-4 w-4 text-sage" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{approvedCount}</p>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="publisher-panel">
            <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as MiniAppStatus | "all")}
              >
                <TabsList className="bg-muted/40">
                  {statusFilters.map((sf) => (
                    <TabsTrigger key={sf.value} value={sf.value} className="text-xs">
                      {sf.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:max-w-72">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="앱, 워크스페이스 검색"
                    className="h-9 border-border/70 bg-card pl-8 text-sm"
                  />
                </div>
                <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
                  <SelectTrigger className="h-9 w-full border-border/70 bg-card text-sm sm:w-40">
                    <SelectValue>
                      {() =>
                        sortOptions.find((option) => option.value === sort)?.label ??
                        "정렬"
                      }
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
            </CardContent>
          </Card>

          {filteredApps.length === 0 ? (
            <EmptyState
              icon={AppWindow}
              title="앱이 없습니다"
              description={
                query
                  ? "검색 조건에 맞는 앱이 없습니다."
                  : filter === "all"
                    ? "워크스페이스에서 미니앱을 등록해보세요."
                    : `'${statusFilters.find((s) => s.value === filter)?.label}' 상태의 앱이 없습니다.`
              }
              action={
                !query && filter === "all"
                  ? { label: "워크스페이스로 이동", href: "/workspace" }
                  : undefined
              }
              className="animate-fade-up"
            />
          ) : (
            <div className="space-y-3">
              {filteredApps.map((app, i) => (
                <div key={app.id} className={`animate-fade-up delay-${Math.min(i + 1, 8)}`}>
                  <AppCard app={app} />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="publisher-panel">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-union/10">
                  <Upload className="h-4 w-4 text-union" />
                </div>
                <div>
                  <p className="text-sm font-semibold">새 앱 등록</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    앱 등록과 빌드 업로드는 워크스페이스에서 시작합니다.
                  </p>
                  <Button className="mt-3 bg-union text-white hover:bg-union/90" size="sm" render={<Link href="/workspace" />}>
                    워크스페이스로 이동
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="publisher-panel">
            <CardContent className="p-4">
              <p className="publisher-eyebrow">Latest Update</p>
              {recentApp ? (
                <div className="mt-3">
                  <p className="truncate text-sm font-semibold">{recentApp.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{recentApp.workspaceName}</p>
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">
                    {new Date(recentApp.updatedAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">아직 등록된 앱이 없습니다.</p>
              )}
            </CardContent>
          </Card>

          <Card className="publisher-panel">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage/10">
                  <Workflow className="h-4 w-4 text-sage" />
                </div>
                <div>
                  <p className="text-sm font-semibold">운영 흐름</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    앱 상세에서 버전 이력, 테스트, 심사 요청, 배포 상태를 이어서 관리하세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
