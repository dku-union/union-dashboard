import {
  AnalyticsOverview,
  RetentionCohort,
  AcquisitionData,
  OsDistribution,
  GenderData,
} from "@/types/analytics";

function generateTrend(baseValue: number, days: number, variance: number) {
  const points = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const value = Math.round(baseValue + (Math.random() - 0.5) * variance);
    points.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, value),
    });
  }
  return points;
}

export const mockAnalyticsOverview: AnalyticsOverview = {
  dau: { value: 3240, change: 12.5, trend: "up" },
  wau: { value: 8750, change: 8.3, trend: "up" },
  mau: { value: 24500, change: -2.1, trend: "down" },
  dauTrend: generateTrend(3200, 30, 800),
  wauTrend: generateTrend(8700, 12, 1500),
  mauTrend: generateTrend(24000, 6, 3000),
};

export const mockRetentionCohorts: RetentionCohort[] = [
  { cohort: "2025-01 W1", users: 1200, week1: 68, week2: 52, week3: 45, week4: 38, week5: 34, week6: 31, week7: 28, week8: 26 },
  { cohort: "2025-01 W2", users: 1350, week1: 72, week2: 55, week3: 48, week4: 41, week5: 37, week6: 33, week7: 30, week8: 0 },
  { cohort: "2025-01 W3", users: 980, week1: 65, week2: 49, week3: 42, week4: 36, week5: 32, week6: 29, week7: 0, week8: 0 },
  { cohort: "2025-01 W4", users: 1100, week1: 70, week2: 53, week3: 46, week4: 39, week5: 35, week6: 0, week7: 0, week8: 0 },
  { cohort: "2025-02 W1", users: 1450, week1: 74, week2: 58, week3: 50, week4: 43, week5: 0, week6: 0, week7: 0, week8: 0 },
  { cohort: "2025-02 W2", users: 1280, week1: 69, week2: 54, week3: 47, week4: 0, week5: 0, week6: 0, week7: 0, week8: 0 },
  { cohort: "2025-02 W3", users: 1520, week1: 76, week2: 59, week3: 0, week4: 0, week5: 0, week6: 0, week7: 0, week8: 0 },
  { cohort: "2025-02 W4", users: 1380, week1: 71, week2: 0, week3: 0, week4: 0, week5: 0, week6: 0, week7: 0, week8: 0 },
];

export const mockAcquisitionData: AcquisitionData[] = [
  { source: "자연 검색", users: 8500, percentage: 34.7 },
  { source: "추천", users: 6200, percentage: 25.3 },
  { source: "소셜 미디어", users: 4800, percentage: 19.6 },
  { source: "직접 유입", users: 3200, percentage: 13.1 },
  { source: "기타", users: 1800, percentage: 7.3 },
];

export const mockOsDistribution: OsDistribution[] = [
  { os: "Android", users: 14700, percentage: 60 },
  { os: "iOS", users: 9800, percentage: 40 },
];

export const mockGenderData: GenderData[] = [
  { gender: "남성", users: 13475, percentage: 55 },
  { gender: "여성", users: 10290, percentage: 42 },
  { gender: "기타", users: 735, percentage: 3 },
];
