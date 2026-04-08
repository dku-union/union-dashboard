"use client";

import type { MiniAppWithWorkspace } from "@/types/app-version";
import { MiniAppStatusBadge } from "./mini-app-status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, History, BarChart3, AppWindow } from "lucide-react";
import Link from "next/link";

export function AppCard({ app }: { app: MiniAppWithWorkspace }) {
  return (
    <Card className="card-hover accent-line overflow-hidden border-border/60 group">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 border border-border/40">
          <AppWindow className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link
              href={`/apps/${app.id}`}
              className="text-sm font-semibold hover:text-union truncate transition-colors"
            >
              {app.name}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={`/apps/${app.id}/versions`} />} className="text-[13px]">
                  <History className="mr-2 h-3.5 w-3.5" />
                  버전 이력
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={`/apps/${app.id}/analytics`} />} className="text-[13px]">
                  <BarChart3 className="mr-2 h-3.5 w-3.5" />
                  분석
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-muted-foreground truncate leading-relaxed">
            {app.description || "설명 없음"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MiniAppStatusBadge status={app.status} />
            <span className="text-[11px] text-muted-foreground/60">
              {app.workspaceName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
