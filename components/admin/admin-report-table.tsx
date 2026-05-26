"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Archive, CheckCircle2, Clock, Search, ShieldAlert, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AdminReportRecord, ReportAction, ReportStatus, ReportTargetType } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reportStatusTone: Record<ReportStatus, string> = {
  PENDING: "border-gold/30 bg-gold/10 text-gold",
  IN_PROGRESS: "border-union/30 bg-union/10 text-union",
  VALID: "border-sage/30 bg-sage/10 text-sage",
  REJECTED: "border-border/60 bg-muted/30 text-muted-foreground",
  ARCHIVED: "border-border/60 bg-muted/20 text-muted-foreground",
};

const reportStatusLabel: Record<ReportStatus, string> = {
  PENDING: "대기",
  IN_PROGRESS: "처리 중",
  VALID: "타당",
  REJECTED: "기각",
  ARCHIVED: "숨김",
};

const targetTypeLabel: Record<ReportTargetType, string> = {
  MINI_APP: "미니앱",
  REVIEW: "리뷰",
  USER: "사용자",
};

const reportReasonLabel: Record<AdminReportRecord["reason"], string> = {
  SPAM: "스팸",
  SCAM: "사기 의심",
  INAPPROPRIATE_CONTENT: "부적절한 콘텐츠",
  HARASSMENT: "괴롭힘/비방",
  PRIVACY_VIOLATION: "개인정보 침해",
  POLICY_VIOLATION: "정책 위반",
  ETC: "기타",
};

const reportActionLabel: Record<ReportAction, string> = {
  NONE: "조치 없음",
  WARN: "경고",
  HOLD_APP: "앱 보류",
  SUSPEND_APP: "앱 정지",
  DELETE_APP: "앱 삭제",
  SUSPEND_USER: "사용자 정지",
};

const statusFilters: { label: string; value: ReportStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "대기", value: "PENDING" },
  { label: "처리 중", value: "IN_PROGRESS" },
  { label: "타당", value: "VALID" },
  { label: "기각", value: "REJECTED" },
  { label: "숨김", value: "ARCHIVED" },
];

const targetFilters: { label: string; value: ReportTargetType | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "미니앱", value: "MINI_APP" },
  { label: "리뷰", value: "REVIEW" },
  { label: "사용자", value: "USER" },
];

const actionOptionsByTarget: Record<ReportTargetType, ReportAction[]> = {
  MINI_APP: ["WARN", "HOLD_APP", "SUSPEND_APP", "DELETE_APP"],
  REVIEW: ["WARN", "DELETE_APP"],
  USER: ["WARN", "SUSPEND_USER"],
};

function formatDate(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminReportTable({
  initialReports,
  loadError,
}: {
  initialReports: AdminReportRecord[];
  loadError?: string;
}) {
  const [reports, setReports] = useState(initialReports);
  const [targetFilter, setTargetFilter] = useState<ReportTargetType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<AdminReportRecord | null>(null);
  const [adminMemo, setAdminMemo] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesTarget = targetFilter === "all" || report.targetType === targetFilter;
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        report.targetLabel.toLowerCase().includes(normalizedQuery) ||
        report.targetSubLabel?.toLowerCase().includes(normalizedQuery) ||
        report.reporterName.toLowerCase().includes(normalizedQuery) ||
        report.reporterEmail.toLowerCase().includes(normalizedQuery) ||
        report.reason.toLowerCase().includes(normalizedQuery);

      return matchesTarget && matchesStatus && matchesQuery;
    });
  }, [query, reports, statusFilter, targetFilter]);

  const openReport = (report: AdminReportRecord) => {
    setSelectedReport(report);
    setAdminMemo(report.adminMemo ?? "");
  };

  const closeDialog = () => {
    setSelectedReport(null);
    setAdminMemo("");
  };

  const updateReport = (id: string, patch: Partial<AdminReportRecord>) => {
    setReports((current) =>
      current.map((report) => (report.id === id ? { ...report, ...patch } : report)),
    );
    setSelectedReport((current) => (current?.id === id ? { ...current, ...patch } : current));
  };

  const handleAction = (status: ReportStatus, actionTaken: ReportAction) => {
    if (!selectedReport) return;

    const reportId = selectedReport.id;

    startTransition(async () => {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          actionTaken,
          adminMemo: adminMemo.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "신고 처리에 실패했습니다.");
        return;
      }

      updateReport(reportId, result.report);
      toast.success("신고 처리가 반영되었습니다.");
    });
  };

  return (
    <>
      <Card className="border-border/60">
        <CardHeader className="gap-4 border-b border-border/60">
          <div className="md:flex md:items-end md:justify-between">
            <div>
              <CardTitle className="heading-display text-lg">신고 접수 목록</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                앱에서 접수된 신고를 확인하고 처리 상태와 관리자 메모를 남깁니다.
              </p>
            </div>
            <div className="mt-3 flex gap-2 md:mt-0">
              <Badge variant="outline" className="border-border/60 bg-muted/20">
                총 {reports.length}건
              </Badge>
              <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold">
                대기 {reports.filter((report) => report.status === "PENDING").length}건
              </Badge>
            </div>
          </div>
          {loadError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {loadError}
            </div>
          )}
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <Tabs value={targetFilter} onValueChange={(value) => setTargetFilter(value as ReportTargetType | "all")}>
              <TabsList>
                {targetFilters.map((target) => (
                  <TabsTrigger key={target.value} value={target.value} className="text-xs">
                    {target.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[520px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="대상, 신고자, 사유 검색"
                  className="h-10 border-border/60 bg-muted/20 pl-9"
                />
              </div>
              <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | "all")}>
                <TabsList>
                  {statusFilters.map((status) => (
                    <TabsTrigger key={status.value} value={status.value} className="text-xs">
                      {status.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead>신고 대상</TableHead>
                <TableHead>신고자</TableHead>
                <TableHead>사유</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>조치</TableHead>
                <TableHead>접수일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    표시할 신고가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer border-border/50"
                    onClick={() => openReport(report)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openReport(report);
                      }
                    }}
                    tabIndex={0}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{report.targetLabel}</p>
                        <p className="text-xs text-muted-foreground">
                          {targetTypeLabel[report.targetType]}
                          {report.targetSubLabel ? ` · ${report.targetSubLabel}` : ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{report.reporterName}</p>
                        <p className="text-xs text-muted-foreground">{report.reporterEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{reportReasonLabel[report.reason]}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={reportStatusTone[report.status]}>
                        {reportStatusLabel[report.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{reportActionLabel[report.actionTaken]}</TableCell>
                    <TableCell className="text-sm">{formatDate(report.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedReport)} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="heading-display text-lg">
              {selectedReport?.targetLabel}
            </DialogTitle>
            <DialogDescription>
              {selectedReport ? reportReasonLabel[selectedReport.reason] : ""} · 신고자 {selectedReport?.reporterName}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">신고 유형</p>
                  <p className="mt-1 font-medium">{targetTypeLabel[selectedReport.targetType]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">현재 상태</p>
                  <p className="mt-1 font-medium">{reportStatusLabel[selectedReport.status]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">처리 조치</p>
                  <p className="mt-1 font-medium">{reportActionLabel[selectedReport.actionTaken]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">처리자</p>
                  <p className="mt-1 font-medium">{selectedReport.reviewedByName ?? "-"}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/60 bg-background px-4 py-4 text-sm leading-relaxed">
                {selectedReport.detail || "상세 신고 내용이 없습니다."}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-memo">관리자 메모</Label>
                <Textarea
                  id="admin-memo"
                  value={adminMemo}
                  onChange={(event) => setAdminMemo(event.target.value)}
                  placeholder="처리 근거 또는 내부 메모를 남기세요."
                  className="min-h-24"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleAction("IN_PROGRESS", "NONE")}
                >
                  <Clock className="h-4 w-4" />
                  처리 중
                </Button>
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleAction("REJECTED", "NONE")}
                >
                  <XCircle className="h-4 w-4" />
                  기각
                </Button>
                {actionOptionsByTarget[selectedReport.targetType].map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleAction("VALID", action)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {reportActionLabel[action]}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleAction("ARCHIVED", selectedReport.actionTaken)}
                >
                  <Archive className="h-4 w-4" />
                  숨김
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>닫기</Button>
            <Button disabled>
              <ShieldAlert className="h-4 w-4" />
              대상 직접 제재는 백엔드 정책 연결 후 활성화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
