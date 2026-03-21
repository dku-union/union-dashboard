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
import { StatusBadge } from "@/components/apps/status-badge";
import { AdminPublisherRecord } from "@/types/admin";

interface AdminPublisherDetailDialogProps {
  publisher: AdminPublisherRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (status: AdminPublisherRecord["status"]) => void;
}

const publisherStatusTone: Record<AdminPublisherRecord["status"], string> = {
  ACTIVE: "border-sage/30 bg-sage/10 text-sage",
  PENDING: "border-gold/30 bg-gold/10 text-gold",
  SUSPENDED: "border-destructive/30 bg-destructive/10 text-destructive",
};

const publisherStatusLabel: Record<AdminPublisherRecord["status"], string> = {
  ACTIVE: "활성",
  PENDING: "대기",
  SUSPENDED: "정지",
};

export function AdminPublisherDetailDialog({
  publisher,
  open,
  onOpenChange,
  onChangeStatus,
}: AdminPublisherDetailDialogProps) {
  if (!publisher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="heading-display text-xl">{publisher.name}</DialogTitle>
              <DialogDescription className="mt-2 space-y-1 text-sm">
                <span className="block">{publisher.email}</span>
                <span className="block">{publisher.contactEmail || "연락 메일 없음"}</span>
              </DialogDescription>
            </div>
            <Badge variant="outline" className={publisherStatusTone[publisher.status]}>
              {publisherStatusLabel[publisher.status]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1.2fr]">
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                계정 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    onClick={() => onChangeStatus("ACTIVE")}
                  >
                    활성으로 변경
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-gold/30 text-gold hover:bg-gold/10"
                    onClick={() => onChangeStatus("PENDING")}
                  >
                    대기로 변경
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => onChangeStatus("SUSPENDED")}
                  >
                    정지로 변경
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
                최근 앱
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {publisher.recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{app.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">v{app.version}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
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
