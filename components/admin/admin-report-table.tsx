"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminReportRecord, AdminUserReportRecord } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reportStatusTone: Record<AdminReportRecord["status"], string> = {
  RECEIVED: "border-gold/30 bg-gold/10 text-gold",
  IN_PROGRESS: "border-union/30 bg-union/10 text-union",
  RESOLVED: "border-sage/30 bg-sage/10 text-sage",
  DISMISSED: "border-border/60 bg-muted/30 text-muted-foreground",
};

const reportFilters: { label: string; value: AdminReportRecord["status"] | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "접수", value: "RECEIVED" },
  { label: "처리 중", value: "IN_PROGRESS" },
  { label: "처리 완료", value: "RESOLVED" },
  { label: "기각", value: "DISMISSED" },
];

type ReportTab = "app" | "user";

export function AdminReportTable({
  initialAppReports,
  initialUserReports,
}: {
  initialAppReports: AdminReportRecord[];
  initialUserReports: AdminUserReportRecord[];
}) {
  const [tab, setTab] = useState<ReportTab>("app");
  const [appReports, setAppReports] = useState(initialAppReports);
  const [userReports, setUserReports] = useState(initialUserReports);
  const [filter, setFilter] = useState<AdminReportRecord["status"] | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedAppReport, setSelectedAppReport] = useState<AdminReportRecord | null>(null);
  const [selectedUserReport, setSelectedUserReport] = useState<AdminUserReportRecord | null>(null);

  const filteredAppReports = useMemo(() => {
    return appReports.filter((report) => {
      const matchesFilter = filter === "all" || report.status === filter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        report.targetName.toLowerCase().includes(normalizedQuery) ||
        report.reporterEmail.toLowerCase().includes(normalizedQuery) ||
        report.reason.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [appReports, filter, query]);

  const filteredUserReports = useMemo(() => {
    return userReports.filter((report) => {
      const matchesFilter = filter === "all" || report.status === filter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        report.reportedUserName.toLowerCase().includes(normalizedQuery) ||
        report.reportedUserEmail.toLowerCase().includes(normalizedQuery) ||
        report.reporterEmail.toLowerCase().includes(normalizedQuery) ||
        report.reason.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, userReports]);

  const handleAppAction = (action: "warning" | "suspend" | "delete" | "dismiss") => {
    if (!selectedAppReport) return;

    const nextStatus = action === "dismiss" ? "DISMISSED" : "RESOLVED";
    setAppReports((current) =>
      current.map((report) =>
        report.id === selectedAppReport.id
          ? { ...report, status: nextStatus, actionTaken: action === "dismiss" ? report.actionTaken : action }
          : report,
      ),
    );
    setSelectedAppReport((current) =>
      current
        ? { ...current, status: nextStatus, actionTaken: action === "dismiss" ? current.actionTaken : action }
        : current,
    );
    toast.success("앱 신고 처리가 반영되었습니다.");
  };

  const handleUserAction = (action: "warning" | "suspend" | "dismiss") => {
    if (!selectedUserReport) return;

    const nextStatus = action === "dismiss" ? "DISMISSED" : "RESOLVED";
    setUserReports((current) =>
      current.map((report) =>
        report.id === selectedUserReport.id
          ? { ...report, status: nextStatus, actionTaken: action }
          : report,
      ),
    );
    setSelectedUserReport((current) =>
      current ? { ...current, status: nextStatus, actionTaken: action } : current,
    );
    toast.success("유저 신고 처리가 반영되었습니다.");
  };

  return (
    <>
      <Card className="border-border/60">
        <CardHeader className="gap-4 border-b border-border/60">
          <div className="md:flex md:items-end md:justify-between">
            <div>
              <CardTitle className="heading-display text-lg">신고 접수 목록</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                앱 신고와 유저 신고를 구분해 검토하고 조치합니다.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={tab} onValueChange={(value) => setTab(value as ReportTab)}>
              <TabsList>
                <TabsTrigger value="app" className="text-xs">앱 신고</TabsTrigger>
                <TabsTrigger value="user" className="text-xs">유저 신고</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[320px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={tab === "app" ? "앱명, 신고자, 사유 검색" : "유저명, 이메일, 사유 검색"}
                  className="h-10 border-border/60 bg-muted/20 pl-9"
                />
              </div>
              <Tabs value={filter} onValueChange={(value) => setFilter(value as AdminReportRecord["status"] | "all")}>
                <TabsList>
                  {reportFilters.map((status) => (
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
          {tab === "app" ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead>신고 대상</TableHead>
                  <TableHead>신고자</TableHead>
                  <TableHead>사유</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>접수일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer border-border/50"
                    onClick={() => setSelectedAppReport(report)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedAppReport(report);
                      }
                    }}
                    tabIndex={0}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{report.targetName}</p>
                        <p className="text-xs text-muted-foreground">{report.targetType === "miniapp" ? "미니앱" : "리뷰"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{report.reporterName}</p>
                        <p className="text-xs text-muted-foreground">{report.reporterEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{report.reason}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={reportStatusTone[report.status]}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{report.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead>신고 대상 유저</TableHead>
                  <TableHead>신고자</TableHead>
                  <TableHead>사유</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>접수일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUserReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer border-border/50"
                    onClick={() => setSelectedUserReport(report)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedUserReport(report);
                      }
                    }}
                    tabIndex={0}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{report.reportedUserName}</p>
                        <p className="text-xs text-muted-foreground">{report.reportedUserEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{report.reporterName}</p>
                        <p className="text-xs text-muted-foreground">{report.reporterEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{report.reason}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={reportStatusTone[report.status]}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{report.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedAppReport)} onOpenChange={(open) => !open && setSelectedAppReport(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="heading-display text-lg">{selectedAppReport?.targetName}</DialogTitle>
            <DialogDescription>
              {selectedAppReport?.reason} · 신고자 {selectedAppReport?.reporterName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-4 text-sm leading-relaxed">
              {selectedAppReport?.detail}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => handleAppAction("warning")}>경고 조치</Button>
              <Button variant="outline" onClick={() => handleAppAction("suspend")}>중지 조치</Button>
              <Button variant="destructive" onClick={() => handleAppAction("delete")}>삭제 조치</Button>
              <Button variant="ghost" onClick={() => handleAppAction("dismiss")}>기각</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAppReport(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedUserReport)} onOpenChange={(open) => !open && setSelectedUserReport(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="heading-display text-lg">{selectedUserReport?.reportedUserName}</DialogTitle>
            <DialogDescription>
              {selectedUserReport?.reason} · 신고자 {selectedUserReport?.reporterName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-4 text-sm leading-relaxed">
              {selectedUserReport?.detail}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => handleUserAction("warning")}>경고 조치</Button>
              <Button variant="outline" onClick={() => handleUserAction("suspend")}>정지 조치</Button>
              <Button variant="ghost" onClick={() => handleUserAction("dismiss")}>기각</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUserReport(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
