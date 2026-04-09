"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { VersionStatusBadge } from "@/components/apps/version-status-badge";
import type { AdminPublisherDetail, AdminPublisherStatus } from "@/types/admin";

interface AdminPublisherDetailDialogProps {
  publisher: AdminPublisherDetail | null;
  open: boolean;
  isLoading: boolean;
  actionLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (status: AdminPublisherStatus) => void;
}

const publisherStatusTone: Record<AdminPublisherStatus, string> = {
  ACTIVE: "border-sage/30 bg-sage/10 text-sage",
  PENDING: "border-gold/30 bg-gold/10 text-gold",
  SUSPENDED: "border-destructive/30 bg-destructive/10 text-destructive",
};

const publisherStatusLabel: Record<AdminPublisherStatus, string> = {
  ACTIVE: "활성",
  PENDING: "대기",
  SUSPENDED: "정지",
};

export function AdminPublisherDetailDialog({
  publisher,
  open,
  isLoading,
  actionLoading,
  onOpenChange,
  onChangeStatus,
}: AdminPublisherDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
          ) : publisher ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="heading-display text-xl">{publisher.name}</DialogTitle>
                <DialogDescription className="mt-2 space-y-1 text-sm">
                  <span className="block">{publisher.email}</span>
                  <span className="block">{publisher.contactEmail ?? "연락 이메일 없음"}</span>
                </DialogDescription>
              </div>
              <Badge variant="outline" className={publisherStatusTone[publisher.status]}>
                {publisherStatusLabel[publisher.status]}
              </Badge>
            </div>
          ) : null}
        </DialogHeader>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1.2fr]">
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                계정 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : publisher ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">전체 앱</p>
                      <p className="heading-display mt-2 text-2xl">{publisher.appCount}</p>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">심사 중</p>
                      <p className="heading-display mt-2 text-2xl">{publisher.inReviewAppCount}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">상태 변경</p>
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        className="justify-start border-sage/30 text-sage hover:bg-sage/10"
                        disabled={actionLoading}
                        onClick={() => onChangeStatus("ACTIVE")}
                      >
                        활성으로 변경
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start border-gold/30 text-gold hover:bg-gold/10"
                        disabled={actionLoading}
                        onClick={() => onChangeStatus("PENDING")}
                      >
                        대기로 변경
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start border-destructive/30 text-destructive hover:bg-destructive/10"
                        disabled={actionLoading}
                        onClick={() => onChangeStatus("SUSPENDED")}
                      >
                        정지로 변경
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">상세 정보를 찾을 수 없습니다.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                최근 앱
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : publisher?.recentApps.length ? (
                publisher.recentApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{app.name}</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {app.version ? `v${app.version}` : "버전 없음"}
                      </p>
                    </div>
                    {app.versionStatus ? (
                      <VersionStatusBadge status={app.versionStatus} />
                    ) : (
                      <span className="text-xs text-muted-foreground">상태 없음</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">최근 앱이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
