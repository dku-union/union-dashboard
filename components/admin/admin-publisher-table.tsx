"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, ShieldBan, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPublisherRecord } from "@/types/admin";
import { AdminPublisherDetailDialog } from "@/components/admin/admin-publisher-detail-dialog";

const publisherFilters: { label: string; value: AdminPublisherRecord["status"] | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "활성", value: "ACTIVE" },
  { label: "대기", value: "PENDING" },
  { label: "정지", value: "SUSPENDED" },
];

const publisherStatusTone: Record<AdminPublisherRecord["status"], string> = {
  ACTIVE: "border-sage/30 bg-sage/10 text-sage",
  PENDING: "border-gold/30 bg-gold/10 text-gold",
  SUSPENDED: "border-destructive/30 bg-destructive/10 text-destructive",
};

const publisherStatusLabel: Record<AdminPublisherRecord["status"], string> = {
  ACTIVE: "활성",
  PENDING: "대기",
  SUSPENDED: "정지",
};

export function AdminPublisherTable({ initialPublishers }: { initialPublishers: AdminPublisherRecord[] }) {
  const [publishers, setPublishers] = useState(initialPublishers);
  const [filter, setFilter] = useState<AdminPublisherRecord["status"] | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<AdminPublisherRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredPublishers = useMemo(() => {
    return publishers.filter((publisher) => {
      const matchesFilter = filter === "all" || publisher.status === filter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        publisher.name.toLowerCase().includes(normalizedQuery) ||
        publisher.email.toLowerCase().includes(normalizedQuery) ||
        (publisher.contactEmail || "").toLowerCase().includes(normalizedQuery);

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
      { label: "승인 대기", value: pendingCount, icon: Users, tone: "text-gold", bg: "bg-gold/10" },
    ];
  }, [publishers]);

  const openDetail = (publisher: AdminPublisherRecord) => {
    setSelectedPublisher(publisher);
    setDetailOpen(true);
  };

  const handleChangeStatus = (status: AdminPublisherRecord["status"]) => {
    if (!selectedPublisher) return;

    setPublishers((current) =>
      current.map((publisher) =>
        publisher.id === selectedPublisher.id ? { ...publisher, status } : publisher,
      ),
    );

    setSelectedPublisher((current) => (current ? { ...current, status } : current));

    toast.success("퍼블리셔 상태가 변경되었습니다.", {
      description: `${selectedPublisher.name} 계정이 ${publisherStatusLabel[status]} 상태로 변경되었습니다.`,
    });
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
                    <p className="heading-display mt-2 text-3xl">{metric.value}</p>
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
                등록된 퍼블리셔 계정을 조회하고 상태를 관리합니다.
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
              <Tabs value={filter} onValueChange={(value) => setFilter(value as AdminPublisherRecord["status"] | "all")}>
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
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead>퍼블리셔</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>앱 수</TableHead>
                  <TableHead>연락 메일</TableHead>
                  <TableHead>가입일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPublishers.map((publisher) => (
                  <TableRow
                    key={publisher.id}
                    className="cursor-pointer border-border/50"
                    onClick={() => openDetail(publisher)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDetail(publisher);
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
                        <p className="text-xs text-muted-foreground">게시 {publisher.publishedAppCount} / 심사 {publisher.inReviewAppCount}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{publisher.contactEmail || "-"}</TableCell>
                    <TableCell className="text-sm">{publisher.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AdminPublisherDetailDialog
        publisher={selectedPublisher}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onChangeStatus={handleChangeStatus}
      />
    </>
  );
}
