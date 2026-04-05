"use client";

import { AppList } from "@/components/apps/app-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { mockMiniApps } from "@/data/mini-apps";

export default function AppsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="heading-display text-2xl tracking-tight">미니앱 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            등록된 미니앱을 관리하고 새 앱을 등록하세요.
          </p>
        </div>
        <Button className="bg-union text-white hover:bg-union/90 group" render={<Link href="/apps/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          새 미니앱 등록
        </Button>
      </div>
      <div className="animate-fade-up delay-2">
        <AppList apps={mockMiniApps} />
      </div>
    </div>
  );
}
