"use client";

import { useState, useEffect } from "react";
import { AnalyticsOverview, RetentionCohort, AcquisitionData, OsDistribution, GenderData } from "@/types/analytics";
import {
  mockAnalyticsOverview,
  mockRetentionCohorts,
  mockAcquisitionData,
  mockOsDistribution,
  mockGenderData,
} from "@/data/analytics";

export function useAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [retention, setRetention] = useState<RetentionCohort[]>([]);
  const [acquisition, setAcquisition] = useState<AcquisitionData[]>([]);
  const [osDistribution, setOsDistribution] = useState<OsDistribution[]>([]);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOverview(mockAnalyticsOverview);
      setRetention(mockRetentionCohorts);
      setAcquisition(mockAcquisitionData);
      setOsDistribution(mockOsDistribution);
      setGenderData(mockGenderData);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return {
    overview,
    retention,
    acquisition,
    osDistribution,
    genderData,
    isLoading,
  };
}
