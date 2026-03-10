export interface MetricData {
  value: number;
  change: number; // percentage change
  trend: "up" | "down" | "neutral";
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface AnalyticsOverview {
  dau: MetricData;
  wau: MetricData;
  mau: MetricData;
  dauTrend: TimeSeriesPoint[];
  wauTrend: TimeSeriesPoint[];
  mauTrend: TimeSeriesPoint[];
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
