"use client";

import { AppList } from "@/components/apps/app-list";
import { useMyMiniApps } from "@/hooks/use-app-versions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AppsPage() {
  const { apps, isLoading } = useMyMiniApps();

  return (
    <div className="publisher-page">
      <div className="publisher-page-header animate-fade-up">
        <div className="max-w-2xl">
          <p className="publisher-eyebrow">Mini Apps</p>
          <h1 className="text-heading-1">미니앱 관리</h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            워크스페이스별 미니앱 상태를 확인하고, 새 버전 업로드와 심사 요청 흐름으로 빠르게 이동하세요.
          </p>
        </div>
        <Button className="bg-union text-white hover:bg-union/90" render={<Link href="/workspace" />}>
          <Plus className="h-4 w-4" />
          미니앱 등록
        </Button>
      </div>
      <div className="animate-fade-up delay-2">
        <AppList apps={apps} isLoading={isLoading} />
      </div>
    </div>
  );
}
