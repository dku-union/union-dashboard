"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, X, Layers, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const { notifications, unreadCount, handleInvitation } = useNotifications();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const router = useRouter();

  const hasWorkspaceInvite = notifications.some(
    (n) => !n.isRead && n.type === "workspace_invitation",
  );

  // 새 알림이 오면 배너 다시 표시
  useEffect(() => {
    if (hasWorkspaceInvite) {
      setBannerDismissed(false);
    }
  }, [hasWorkspaceInvite]);

  const onAction = async (invitationId: string, action: "accept" | "decline") => {
    setProcessingIds((prev) => new Set(prev).add(invitationId));
    const success = await handleInvitation(invitationId, action);
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(invitationId);
      return next;
    });
    if (success && action === "accept") {
      router.push("/workspace");
    }
  };

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead).slice(0, 10);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="h-8 w-8 relative" />
        }>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold">알림</p>
          </div>
          <DropdownMenuSeparator />

          {notifications.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              알림이 없습니다
            </div>
          ) : (
            <>
              {unread.map((n) => (
                <div key={n.id} className="px-3 py-2.5 bg-union/[0.03] border-l-2 border-union">
                  <div className="flex items-start gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-union/10 shrink-0 mt-0.5">
                      <Layers className="h-3.5 w-3.5 text-union" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString("ko-KR") : ""}
                      </p>

                      {n.type === "workspace_invitation" && n.referenceId && (
                        <div className="flex gap-1.5 mt-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-union text-white hover:bg-union/90"
                            disabled={processingIds.has(n.referenceId)}
                            onClick={(e) => {
                              e.preventDefault();
                              onAction(n.referenceId!, "accept");
                            }}
                          >
                            {processingIds.has(n.referenceId) ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            수락
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-border/60"
                            disabled={processingIds.has(n.referenceId)}
                            onClick={(e) => {
                              e.preventDefault();
                              onAction(n.referenceId!, "decline");
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            거절
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {read.length > 0 && unread.length > 0 && <DropdownMenuSeparator />}

              {read.map((n) => (
                <div key={n.id} className="px-3 py-2.5 opacity-60">
                  <div className="flex items-start gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60 shrink-0 mt-0.5">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString("ko-KR") : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 알림 배너 — workspace 초대 알림이 있을 때 벨 아래에 작은 안내 표시 */}
      {hasWorkspaceInvite && !bannerDismissed && (
        <div className="absolute top-full right-0 mt-1 z-50 animate-fade-up">
          <div className="bg-union text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
            <Layers className="h-3 w-3 shrink-0" />
            워크스페이스 초대 알림이 있습니다
            <button
              onClick={() => setBannerDismissed(true)}
              className="ml-1 hover:opacity-70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="absolute -top-1 right-3 w-2 h-2 bg-union rotate-45" />
        </div>
      )}
    </div>
  );
}
