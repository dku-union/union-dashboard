export interface MetricData {
  value: number;
  change: number; // percentage change
  trend: "up" | "down" | "neutral";
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export type AnalyticsRange = "today" | "last_7_days" | "last_30_days" | "this_month" | "all";

export interface AnalyticsMiniAppOption {
  id: number;
  name: string;
}

export interface AnalyticsAppBreakdown {
  id: number;
  name: string;
  launches: number;
  activeUsers: number;
  dau: number;
  mau: number;
}

export interface AnalyticsOverview {
  totalLaunches: MetricData;
  activeUsers: MetricData;
  usedMiniApps: MetricData;
}

export interface UsageAnalytics {
  workspaceId: string;
  miniAppId: number | "all";
  range: AnalyticsRange;
  from: string | null;
  to: string;
  apps: AnalyticsMiniAppOption[];
  overview: AnalyticsOverview;
  dailyTrend: TimeSeriesPoint[];
  appBreakdown: AnalyticsAppBreakdown[];
}

export interface RetentionCohort {
  cohort: string;
  users: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  week6: number;
  week7: number;
  week8: number;
}

export interface AcquisitionData {
  source: string;
  users: number;
  percentage: number;
}

export interface OsDistribution {
  os: string;
  users: number;
  percentage: number;
}

export interface GenderData {
  gender: string;
  users: number;
  percentage: number;
}
