"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AnalyticsRange, UsageAnalytics } from "@/types/analytics";

interface UseAnalyticsParams {
  workspaceId?: string;
  miniAppId?: number | "all";
  range: AnalyticsRange;
}

export function useAnalytics({ workspaceId, miniAppId = "all", range }: UseAnalyticsParams) {
  const [data, setData] = useState<UsageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    if (!workspaceId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        workspaceId,
        range,
        miniAppId: String(miniAppId),
      });
      const res = await fetch(`/api/analytics/usage?${params.toString()}`, {
        cache: "no-store",
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "분석 데이터를 불러오지 못했습니다.");
        setData(null);
        return;
      }

      setData(result);
    } catch {
      toast.error("분석 데이터를 불러오는 중 오류가 발생했습니다.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [miniAppId, range, workspaceId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    isLoading,
    refetch: fetchAnalytics,
  };
}
