"use client";

import { use } from "react";
import { mockMiniApps } from "@/data/mini-apps";
import { StatusBadge } from "@/components/apps/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AppWindow, History } from "lucide-react";
import Link from "next/link";

export default function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const app = mockMiniApps.find((a) => a.id === id);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-fade-up">
        <Button variant="ghost" size="icon" className="hover:text-union" render={<Link href={`/apps/${id}`} />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-union/10 to-union/5 border border-union/10">
            <History className="h-5 w-5 text-union/70" />
          </div>
          <div>
            <h1 className="heading-display text-2xl tracking-tight">
              {app.name}
            </h1>
            <p className="text-sm text-muted-foreground">버전 이력</p>
          </div>
        </div>
      </div>

      <Card className="animate-fade-up delay-1 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
            전체 버전 ({app.versions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead className="text-xs uppercase tracking-wider">버전</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">상태</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">릴리즈 노트</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">제출일</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">심사일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...app.versions].reverse().map((ver) => (
                <TableRow key={ver.id} className="border-border/40">
                  <TableCell className="font-mono text-sm font-medium">v{ver.version}</TableCell>
                  <TableCell>
                    <StatusBadge status={ver.status} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {ver.releaseNote}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{ver.submittedAt || "-"}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{ver.reviewedAt || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
