"use client";

import { useState } from "react";
import type { MiniAppWithWorkspace, MiniAppStatus } from "@/types/app-version";
import { AppCard } from "./app-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AppWindow } from "lucide-react";

const statusFilters: { label: string; value: MiniAppStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "대기 중", value: "PENDING" },
  { label: "승인됨", value: "APPROVED" },
];

interface AppListProps {
  apps: MiniAppWithWorkspace[];
  isLoading: boolean;
}

export function AppList({ apps, isLoading }: AppListProps) {
  const [filter, setFilter] = useState<MiniAppStatus | "all">("all");

  const filteredApps =
    filter === "all" ? apps : apps.filter((a) => a.status === filter);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as MiniAppStatus | "all")}
      >
        <TabsList className="animate-fade-up">
          {statusFilters.map((sf) => (
            <TabsTrigger key={sf.value} value={sf.value} className="text-xs">
              {sf.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
            <AppWindow className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="heading-display text-lg">앱이 없습니다</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "all"
              ? "워크스페이스에서 미니앱을 등록해보세요."
              : `'${statusFilters.find((s) => s.value === filter)?.label}' 상태의 앱이 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app, i) => (
            <div key={app.id} className={`animate-fade-up delay-${Math.min(i + 1, 8)}`}>
              <AppCard app={app} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
