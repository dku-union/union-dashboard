"use client";

import Link from "next/link";
import {
  AlertTriangle,
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Plus,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { StatusBadge } from "@/components/apps/status-badge";
import { mockMiniApps } from "@/data/mini-apps";
import { mockReviews } from "@/data/reviews";

export default function DashboardHome() {
  const { user } = useAuth();

  const publishedCount = mockMiniApps.filter((a) => a.status === "published").length;
  const inReviewCount = mockMiniApps.filter((a) => a.status === "in_review").length;
  const totalApps = mockMiniApps.length;
  const rejectedApps = mockMiniApps.filter((a) => a.status === "rejected");
  const actionCount = mockReviews.filter((r) => r.status === "rejected").length;

  const quickActions = [
    {
      href: "/apps/new",
      icon: Plus,
      label: "미니앱 등록",
      description: "새 앱을 등록하고 첫 릴리즈를 준비하세요.",
    },
    {
      href: "/apps",
      icon: AppWindow,
      label: "미니앱 관리",
      description: "등록된 앱 목록을 확인하고 버전을 관리하세요.",
    },
    {
      href: "/reviews",
      icon: ClipboardCheck,
      label: "심사 현황",
      description: "진행 중인 심사와 반려 이력을 확인하세요.",
    },
    {
      href: "/workspace",
      icon: Users,
      label: "워크스페이스",
      description: "팀원을 초대하고 퍼블리셔 리소스를 공유하세요.",
    },
    {
      href: "/analytics",
      icon: BarChart3,
      label: "분석",
      description: "앱별 사용 지표와 설치 추이를 확인하세요.",
    },
    {
      href: "/docs",
      icon: BookOpen,
      label: "개발 문서",
      description: "Bridge API 가이드와 심사 제출 안내를 확인하세요.",
    },
  ];

  return (
    <div className="max-w-5xl space-y-10">

      {/* ─── Header ──────────────────────────────────────── */}
      <div className="animate-fade-up">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 mb-1.5">
          Publisher Dashboard
        </p>
        <h1 className="heading-display text-2xl tracking-tight">
          안녕하세요,{" "}
          <span className="union-underline">{user?.name ?? "퍼블리셔"}</span>님
        </h1>
      </div>

      {/* ─── Stats row ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-fade-up delay-1">
        <div className="rounded-xl border border-border/60 bg-card px-5 py-5 space-y-2.5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">전체 앱</p>
          <p className="heading-display text-[2.25rem] leading-none">{totalApps}</p>
          <p className="text-[11px] text-muted-foreground/40">등록된 미니앱</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card px-5 py-5 space-y-2.5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">라이브</p>
          <p className="heading-display text-[2.25rem] leading-none text-union">
            {publishedCount}
          </p>
          <p className="text-[11px] text-muted-foreground/40">스토어 게시 중</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card px-5 py-5 space-y-2.5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">심사 중</p>
          <p className="heading-display text-[2.25rem] leading-none">{inReviewCount}</p>
          <p className="text-[11px] text-muted-foreground/40">검토 대기 중</p>
        </div>

        <div
          className={`rounded-xl border bg-card px-5 py-5 space-y-2.5 transition-colors ${
            actionCount > 0 ? "border-destructive/30" : "border-border/60"
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
            처리 필요
          </p>
          <p className={`heading-display text-[2.25rem] leading-none ${actionCount > 0 ? "text-destructive" : ""}`}>
            {actionCount}
          </p>
          <p className="text-[11px] text-muted-foreground/40">재심사 제출 대기</p>
        </div>
      </div>

      {/* ─── Quick actions (primary content) ────────────── */}
      <div className="animate-fade-up delay-2">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/50 mb-4">
          주요 기능
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-start gap-4 rounded-xl border border-border/60 bg-card px-5 py-4 hover:border-union/40 hover:bg-muted/20 transition-all duration-200"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                <action.icon className="h-[15px] w-[15px] text-muted-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{action.label}</p>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-[12px] text-muted-foreground/60 mt-0.5 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Reviews + alert ─────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-5 animate-fade-up delay-3">

        {/* Reviews table — 3/5 */}
        <div className="lg:col-span-3 rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
              최근 심사 현황
            </p>
            <Link
              href="/reviews"
              className="text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors flex items-center gap-1"
            >
              전체 보기 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/30">
            {mockReviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/25 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{review.appName}</p>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5 tabular-nums">
                    v{review.version}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <StatusBadge status={review.status} />
                  <span className="text-[11px] text-muted-foreground/35 hidden sm:block tabular-nums">
                    {review.submittedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rejected alert — 2/5 */}
        <div className="lg:col-span-2 space-y-4">
          {rejectedApps.length > 0 && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-destructive/10">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <p className="text-[11px] font-semibold text-destructive uppercase tracking-wider">
                  조치 필요
                </p>
              </div>
              <div className="p-2 space-y-1">
                {rejectedApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/apps/${app.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-destructive/10 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate">{app.name}</p>
                      <p className="text-[11px] text-destructive/60">
                        v{app.currentVersion} · 반려됨
                      </p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-destructive/40 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
