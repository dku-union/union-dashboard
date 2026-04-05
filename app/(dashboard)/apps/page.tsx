"use client";

import { AppList } from "@/components/apps/app-list";
import { useMyMiniApps } from "@/hooks/use-app-versions";

export default function AppsPage() {
  const { apps, isLoading } = useMyMiniApps();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="heading-display text-2xl tracking-tight">미니앱 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            등록된 미니앱을 관리하세요.
          </p>
        </div>
      </div>
      <div className="animate-fade-up delay-2">
        <AppList apps={apps} isLoading={isLoading} />
      </div>
    </div>
  );
}
