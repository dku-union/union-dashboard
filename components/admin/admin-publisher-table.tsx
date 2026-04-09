"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, ShieldBan, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPublisherDetailDialog } from "@/components/admin/admin-publisher-detail-dialog";
import type { AdminPublisherDetail, AdminPublisherListItem, AdminPublisherStatus } from "@/types/admin";

const publisherFilters: { label: string; value: AdminPublisherStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "활성", value: "ACTIVE" },
  { label: "대기", value: "PENDING" },
  { label: "정지", value: "SUSPENDED" },
];

const publisherStatusTone: Record<AdminPublisherStatus, string> = {
  ACTIVE: "border-sage/30 bg-sage/10 text-sage",
  PENDING: "border-gold/30 bg-gold/10 text-gold",
  SUSPENDED: "border-destructive/30 bg-destructive/10 text-destructive",
};

const publisherStatusLabel: Record<AdminPublisherStatus, string> = {
  ACTIVE: "활성",
  PENDING: "대기",
  SUSPENDED: "정지",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR");
}

export function AdminPublisherTable() {
  const [publishers, setPublishers] = useState<AdminPublisherListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AdminPublisherStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedPublisherId, setSelectedPublisherId] = useState<string | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<AdminPublisherDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPublishers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/publishers", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "퍼블리셔 목록을 불러오지 못했습니다.");
      }

      setPublishers(data.publishers);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "퍼블리셔 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPublishers();
  }, []);

  const filteredPublishers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return publishers.filter((publisher) => {
      const matchesFilter = filter === "all" || publisher.status === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        publisher.name.toLowerCase().includes(normalizedQuery) ||
        publisher.email.toLowerCase().includes(normalizedQuery) ||
        (publisher.contactEmail ?? "").toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, publishers, query]);

  const metrics = useMemo(() => {
    const activeCount = publishers.filter((publisher) => publisher.status === "ACTIVE").length;
    const pendingCount = publishers.filter((publisher) => publisher.status === "PENDING").length;
    const suspendedCount = publishers.filter((publisher) => publisher.status === "SUSPENDED").length;

    return [
      { label: "전체 퍼블리셔", value: publishers.length, icon: Users, tone: "text-union", bg: "bg-union/10" },
      { label: "활성 계정", value: activeCount, icon: UserCheck, tone: "text-sage", bg: "bg-sage/10" },
      { label: "정지 계정", value: suspendedCount, icon: ShieldBan, tone: "text-destructive", bg: "bg-destructive/10" },
      { label: "대기 계정", value: pendingCount, icon: Users, tone: "text-gold", bg: "bg-gold/10" },
    ];
  }, [publishers]);

  const openDetail = async (publisherId: string) => {
    setSelectedPublisherId(publisherId);
    setDetailOpen(true);
    setDetailLoading(true);

    try {
      const response = await fetch(`/api/admin/publishers/${publisherId}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "퍼블리셔 상세를 불러오지 못했습니다.");
      }

      setSelectedPublisher(data.publisher);
    } catch (fetchError) {
      toast.error(
        fetchError instanceof Error
          ? fetchError.message
          : "퍼블리셔 상세를 불러오지 못했습니다.",
      );
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleChangeStatus = async (status: AdminPublisherStatus) => {
    if (!selectedPublisherId || actionLoading) return;

    setActionLoading(true);

    try {
      const response = await fetch(`/api/admin/publishers/${selectedPublisherId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "퍼블리셔 상태를 변경하지 못했습니다.");
      }

      setPublishers((current) =>
        current.map((publisher) =>
          publisher.id === selectedPublisherId ? { ...publisher, status: data.status } : publisher,
        ),
      );
      setSelectedPublisher((current) =>
        current ? { ...current, status: data.status } : current,
      );

      toast.success("퍼블리셔 상태를 변경했습니다.");
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "퍼블리셔 상태를 변경하지 못했습니다.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={metric.label} className={`card-hover animate-fade-up delay-${index + 1} border-border/60`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{metric.label}</p>
                    {isLoading ? (
                      <Skeleton className="mt-2 h-8 w-20" />
                    ) : (
                      <p className="heading-display mt-2 text-3xl">{metric.value}</p>
                    )}
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bg}`}>
                    <metric.icon className={`h-5 w-5 ${metric.tone}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="animate-fade-up delay-5 border-border/60">
          <CardHeader className="gap-4 border-b border-border/60 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle className="heading-display text-lg">퍼블리셔 목록</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                등록된 계정과 운영 상태를 확인하고 관리합니다.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[320px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="이름, 이메일, 연락처 검색"
                  className="h-10 border-border/60 bg-muted/20 pl-9"
                />
              </div>
              <Tabs value={filter} onValueChange={(value) => setFilter(value as AdminPublisherStatus | "all")}>
                <TabsList>
                  {publisherFilters.map((status) => (
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
                <Button variant="outline" onClick={() => void fetchPublishers()}>
                  다시 시도
                </Button>
              </div>
            ) : filteredPublishers.length === 0 ? (
              <p className="text-sm text-muted-foreground">조건에 맞는 퍼블리셔가 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60">
                    <TableHead>퍼블리셔</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>앱 현황</TableHead>
                    <TableHead>연락 이메일</TableHead>
                    <TableHead>가입일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPublishers.map((publisher) => (
                    <TableRow
                      key={publisher.id}
                      className="cursor-pointer border-border/50"
                      onClick={() => void openDetail(publisher.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          void openDetail(publisher.id);
                        }
                      }}
                      tabIndex={0}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{publisher.name}</p>
                          <p className="text-xs text-muted-foreground">{publisher.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={publisherStatusTone[publisher.status]}>
                          {publisherStatusLabel[publisher.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>전체 {publisher.appCount}</p>
                          <p className="text-xs text-muted-foreground">
                            게시 {publisher.publishedAppCount} / 심사 {publisher.inReviewAppCount}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{publisher.contactEmail ?? "-"}</TableCell>
                      <TableCell className="text-sm">{formatDate(publisher.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminPublisherDetailDialog
        publisher={selectedPublisher}
        open={detailOpen}
        isLoading={detailLoading}
        actionLoading={actionLoading}
        onOpenChange={setDetailOpen}
        onChangeStatus={(status) => void handleChangeStatus(status)}
      />
    </>
  );
}
