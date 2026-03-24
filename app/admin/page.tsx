"use client";

import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, AppWindow, ClipboardCheck, Shield } from "lucide-react";
import { mockAdminPublishers } from "@/data/admin-publishers";
import { mockMiniApps } from "@/data/mini-apps";
import { mockAdminReviews } from "@/data/admin-reviews";
import { mockAdminReports } from "@/data/admin-reports";
import { mockAdminUsers } from "@/data/admin-users";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "총 사용자", value: mockAdminUsers.length, icon: Users, color: "text-foreground", bg: "bg-gradient-to-br from-foreground/5 to-foreground/[0.02]" },
    { label: "전체 앱", value: mockMiniApps.length, icon: AppWindow, color: "text-sage", bg: "bg-gradient-to-br from-sage/10 to-sage/5" },
    { label: "심사 대기", value: mockAdminReviews.filter((review) => review.status === "in_review").length, icon: ClipboardCheck, color: "text-gold", bg: "bg-gradient-to-br from-gold/10 to-gold/5" },
    { label: "신고 접수", value: mockAdminReports.filter((report) => report.status === "RECEIVED" || report.status === "IN_PROGRESS").length, icon: Shield, color: "text-destructive", bg: "bg-gradient-to-br from-destructive/10 to-destructive/5" },
  ];

  const recentReviews = mockAdminReviews.filter((review) => review.status === "in_review").slice(0, 3);
  const rejectedReviews = mockAdminReviews.filter((review) => review.status === "rejected").slice(0, 3);
  const attentionPublishers = mockAdminPublishers.filter((publisher) => publisher.status !== "ACTIVE").slice(0, 3);
  const activeReports = mockAdminReports.filter((report) => report.status === "RECEIVED" || report.status === "IN_PROGRESS").slice(0, 3);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="animate-fade-up">
        <h1 className="heading-display text-3xl tracking-tight">
          관리자 대시보드
        </h1>
        <p className="text-muted-foreground mt-1">
          안녕하세요, {user?.name}님. Union 플랫폼 관리 현황입니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} className={`card-hover animate-fade-up delay-${i + 1} border-border/60`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {stat.label}
                  </p>
                  <p className="heading-display text-3xl">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <Card className="animate-fade-up delay-5 border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              최근 심사 요청
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {recentReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                <p className="text-sm font-medium">{review.appName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{review.publisherName}</p>
                <p className="mt-1 text-xs font-mono text-muted-foreground/70">v{review.version} · {review.submittedAt}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/apps" />}>
              심사 큐 보기
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-6 border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              최근 반려 건
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {rejectedReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-3">
                <p className="text-sm font-medium">{review.appName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{review.reviewerNote || "반려 사유 확인 필요"}</p>
                <p className="mt-1 text-xs font-mono text-muted-foreground/70">검토 {review.reviewedAt}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/apps" />}>
              반려 건 검토
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-7 border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              주의 필요 퍼블리셔
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {attentionPublishers.map((publisher) => (
              <div key={publisher.id} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                <p className="text-sm font-medium">{publisher.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{publisher.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  상태 {publisher.status} · 심사 중 {publisher.inReviewAppCount}건
                </p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/publishers" />}>
              퍼블리셔 관리
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-8 border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              신고 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {activeReports.map((report) => (
              <div key={report.id} className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                <p className="text-sm font-medium">{report.targetName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{report.reason}</p>
                <p className="mt-1 text-xs font-mono text-muted-foreground/70">{report.status} · {report.createdAt}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-border/60" render={<Link href="/admin/reports" />}>
              신고 관리
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
