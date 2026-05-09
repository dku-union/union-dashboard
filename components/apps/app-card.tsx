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
import { MoreVertical, History, BarChart3, AppWindow, ArrowUpRight, Building2, Upload } from "lucide-react";
import Link from "next/link";

export function AppCard({ app }: { app: MiniAppWithWorkspace }) {
  return (
    <Card className="publisher-panel group overflow-hidden transition-colors hover:border-union/45">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3 sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/55">
          {app.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.iconUrl} alt="" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <AppWindow className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/apps/${app.id}`}
              className="group/link flex min-w-0 items-center gap-1.5 text-sm font-semibold transition-colors hover:text-union"
            >
              <span className="truncate">{app.name}</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
            </Link>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="hidden border-border/70 text-xs sm:inline-flex"
                render={<Link href={`/workspace/${app.workspaceId}/upload?miniAppId=${app.id}`} />}
              >
                <Upload className="h-3.5 w-3.5" />
                새 버전
              </Button>
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
                <DropdownMenuItem render={<Link href={`/workspace/${app.workspaceId}/upload?miniAppId=${app.id}`} />} className="text-[13px]">
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  새 버전 업로드
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={`/apps/${app.id}/analytics`} />} className="text-[13px]">
                  <BarChart3 className="mr-2 h-3.5 w-3.5" />
                  분석
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
            {app.description || "설명 없음"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <MiniAppStatusBadge status={app.status} />
            <span className="inline-flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground/70">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">
              {app.workspaceName}
              </span>
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground/60">
            {new Date(app.updatedAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
