"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, PauseCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MiniAppStatusBadge } from "@/components/apps/mini-app-status-badge";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import type { AdminManagedAppRecord } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusFilters: { label: string; value: AdminManagedAppRecord["status"] | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "승인", value: "APPROVED" },
  { label: "보류", value: "PENDING" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR");
}

export function AdminAppManagementTable() {
  const [apps, setApps] = useState<AdminManagedAppRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AdminManagedAppRecord["status"] | "all">("all");
  const [query, setQuery] = useState("");
  const [actionId, setActionId] = useState<number | null>(null);

  const fetchApps = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/mini-apps", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "미니앱 목록을 불러오지 못했습니다.");
      }

      setApps(data.apps);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "미니앱 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchApps();
  }, []);

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesFilter = filter === "all" || app.status === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        app.name.toLowerCase().includes(normalizedQuery) ||
        (app.publisherName ?? "").toLowerCase().includes(normalizedQuery) ||
        (app.publisherEmail ?? "").toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [apps, filter, query]);

  const handleStatusChange = async (app: AdminManagedAppRecord) => {
    const nextStatus = app.status === "APPROVED" ? "PENDING" : "APPROVED";
    setActionId(app.id);

    try {
      const response = await fetch(`/api/admin/mini-apps/${app.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "미니앱 상태를 변경하지 못했습니다.");
      }

      setApps((current) =>
        current.map((item) => (item.id === app.id ? { ...item, status: data.status } : item)),
      );
      toast.success("미니앱 상태를 변경했습니다.");
    } catch (actionError) {
      toast.error(
        actionError instanceof Error ? actionError.message : "미니앱 상태를 변경하지 못했습니다.",
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="gap-4 border-b border-border/60 md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle className="heading-display text-lg">전체 미니앱 운영</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            퍼블리셔, 승인 상태, 최신 버전 상태를 한 화면에서 관리합니다.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[320px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="앱명, 퍼블리셔 검색"
              className="h-10 border-border/60 bg-muted/20 pl-9"
            />
          </div>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as AdminManagedAppRecord["status"] | "all")}>
            <TabsList>
              {statusFilters.map((status) => (
                <TabsTrigger key={status.value} value={status.value} className="text-xs">
                  {status.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={() => void fetchApps()}>
              다시 시도
            </Button>
          </div>
        ) : filteredApps.length === 0 ? (
          <p className="text-sm text-muted-foreground">조건에 맞는 미니앱이 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead>앱 정보</TableHead>
                <TableHead>퍼블리셔</TableHead>
                <TableHead>앱 상태</TableHead>
                <TableHead>최신 버전</TableHead>
                <TableHead>수정일</TableHead>
                <TableHead className="text-right">조치</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id} className="border-border/50">
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{app.name}</p>
                      <p className="font-mono text-xs text-muted-foreground/70">
                        {app.currentVersion ? `v${app.currentVersion}` : "버전 없음"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{app.publisherName ?? "-"}</p>
                      <p className="text-xs text-muted-foreground">{app.publisherEmail ?? "-"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <MiniAppStatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    {app.currentVersionStatus ? (
                      <VersionStatusBadge status={app.currentVersionStatus} />
                    ) : (
                      <span className="text-xs text-muted-foreground">없음</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(app.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionId === app.id}
                        onClick={() => void handleStatusChange(app)}
                      >
                        {app.status === "APPROVED" ? (
                          <>
                            <PauseCircle className="mr-1 h-3.5 w-3.5" />
                            보류
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            승인
                          </>
                        )}
                      </Button>
                      <Button variant="destructive" size="sm" disabled>
                        삭제 준비 중
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
