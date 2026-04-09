"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, PauseCircle, PlayCircle, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/apps/status-badge";
import { CATEGORY_LABELS } from "@/lib/constants";
import { AdminManagedAppRecord } from "@/types/admin";
import { MiniAppStatus } from "@/types/mini-app";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusFilters: { label: string; value: MiniAppStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "게시됨", value: "published" },
  { label: "심사 중", value: "in_review" },
  { label: "정지됨", value: "suspended" },
  { label: "초안", value: "draft" },
];

export function AdminAppManagementTable({ initialApps }: { initialApps: AdminManagedAppRecord[] }) {
  const [apps, setApps] = useState(initialApps);
  const [filter, setFilter] = useState<MiniAppStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesFilter = filter === "all" || getLegacyStatus(app.status) === filter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        app.name.toLowerCase().includes(normalizedQuery) ||
        (app.publisherName ?? "").toLowerCase().includes(normalizedQuery) ||
        (app.publisherEmail ?? "").toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [apps, filter, query]);

  const updateStatus = (appId: string | number, status: MiniAppStatus, message: string) => {
    setApps((current) =>
      current.map((app) =>
        app.id === appId ? { ...app, status, forcedActionNote: message } : app,
      ),
    );
  };

  const handleSuspend = (app: AdminManagedAppRecord) => {
    updateStatus(app.id, "suspended", "관리자 강제 중지 처리");
    toast.success(`${app.name}이(가) 강제 중지되었습니다.`);
  };

  const handleResume = (app: AdminManagedAppRecord) => {
    updateStatus(app.id, "published", "관리자 재개 처리");
    toast.success(`${app.name}이(가) 다시 게시 상태로 전환되었습니다.`);
  };

  const handleDelete = (app: AdminManagedAppRecord) => {
    setApps((current) => current.filter((item) => item.id !== app.id));
    toast.success(`${app.name}이(가) 목록에서 삭제 처리되었습니다.`);
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="gap-4 border-b border-border/60 md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle className="heading-display text-lg">전체 미니앱 운영</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            플랫폼 전체 미니앱의 상태를 조회하고 강제 중지, 재개, 삭제를 처리합니다.
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
          <Tabs value={filter} onValueChange={(value) => setFilter(value as MiniAppStatus | "all")}>
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
        <Table>
          <TableHeader>
            <TableRow className="border-border/60">
              <TableHead>앱 정보</TableHead>
              <TableHead>퍼블리셔</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>신고</TableHead>
              <TableHead>최근 변경</TableHead>
              <TableHead className="text-right">조치</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.map((app) => (
              <TableRow key={app.id} className="border-border/50">
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{app.name}</p>
                      <Badge variant="outline" className="border-border/60 bg-background">
                        {app.category ? CATEGORY_LABELS[app.category] : "-"}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground/70">v{app.currentVersion}</p>
                    {app.forcedActionNote ? (
                      <p className="text-xs text-muted-foreground">{app.forcedActionNote}</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{app.publisherName ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{app.publisherEmail ?? "-"}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={getLegacyStatus(app.status)} />
                </TableCell>
                <TableCell>
                  {(app.reportCount ?? 0) > 0 ? (
                    <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {app.reportCount ?? 0}건
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">없음</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{app.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {getLegacyStatus(app.status) === "suspended" ? (
                      <Button variant="outline" size="sm" onClick={() => handleResume(app)}>
                        <PlayCircle className="mr-1 h-3.5 w-3.5" />
                        재개
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleSuspend(app)}>
                        <PauseCircle className="mr-1 h-3.5 w-3.5" />
                        중지
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(app)}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      삭제
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const getLegacyStatus = (status: AdminManagedAppRecord["status"]): MiniAppStatus =>
  status as MiniAppStatus;
