"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { MetricCard } from "@/components/analytics/metric-card";
import { LineChartCard } from "@/components/analytics/line-chart-card";
import { BarChartCard } from "@/components/analytics/bar-chart-card";
import { PieChartCard } from "@/components/analytics/pie-chart-card";
import { RetentionTable } from "@/components/analytics/retention-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserPlus } from "lucide-react";

export default function AnalyticsPage() {
  const { overview, retention, acquisition, osDistribution, genderData, isLoading } =
    useAnalytics();

  if (isLoading || !overview) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="heading-display text-2xl tracking-tight">분석</h1>
          <p className="text-sm text-muted-foreground mt-1">전체 미니앱 사용 통계</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">분석</h1>
        <p className="text-sm text-muted-foreground mt-1">전체 미니앱 사용 통계</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="animate-fade-up delay-1">
          <MetricCard
            title="DAU"
            subtitle="일간 활성 사용자"
            data={overview.dau}
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
          />
        </div>
        <div className="animate-fade-up delay-2">
          <MetricCard
            title="WAU"
            subtitle="주간 활성 사용자"
            data={overview.wau}
            icon={<UserCheck className="h-5 w-5 text-muted-foreground" />}
          />
        </div>
        <div className="animate-fade-up delay-3">
          <MetricCard
            title="MAU"
            subtitle="월간 활성 사용자"
            data={overview.mau}
            icon={<UserPlus className="h-5 w-5 text-muted-foreground" />}
          />
        </div>
      </div>

      <div className="animate-fade-up delay-4">
        <LineChartCard title="DAU 추세 (30일)" data={overview.dauTrend} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="animate-fade-up delay-5">
          <LineChartCard title="WAU 추세 (12주)" data={overview.wauTrend} color="var(--gold)" />
        </div>
        <div className="animate-fade-up delay-6">
          <LineChartCard title="MAU 추세 (6개월)" data={overview.mauTrend} color="var(--sage)" />
        </div>
      </div>

      <div className="animate-fade-up delay-7">
        <RetentionTable data={retention} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="animate-fade-up delay-8">
          <BarChartCard
            title="유입 경로"
            data={acquisition.map((a) => ({ name: a.source, value: a.users }))}
          />
        </div>
        <div className="animate-fade-up delay-8">
          <PieChartCard
            title="OS 분포"
            data={osDistribution.map((o) => ({ name: o.os, value: o.users }))}
          />
        </div>
        <div className="animate-fade-up delay-8">
          <PieChartCard
            title="성별 분석"
            data={genderData.map((g) => ({ name: g.gender, value: g.users }))}
          />
        </div>
      </div>
    </div>
  );
}
