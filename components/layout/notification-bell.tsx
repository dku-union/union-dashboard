"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Layers, Loader2, X } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationBell() {
  const { notifications, unreadCount, handleInvitation } = useNotifications();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [dismissedInviteSignature, setDismissedInviteSignature] = useState<string | null>(null);
  const router = useRouter();

  const unread = notifications.filter((notification) => !notification.isRead);
  const read = notifications.filter((notification) => notification.isRead).slice(0, 10);
  const hasWorkspaceInvite = unread.some(
    (notification) => notification.type === "workspace_invitation",
  );
  const inviteSignature = unread
    .filter((notification) => notification.type === "workspace_invitation")
    .map((notification) => notification.referenceId ?? notification.id)
    .join(":");
  const showInviteBanner = hasWorkspaceInvite && dismissedInviteSignature !== inviteSignature;

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

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="relative h-8 w-8" />}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-96 w-80 overflow-y-auto">
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
              {unread.map((notification) => (
                <div
                  key={notification.id}
                  className="border-l-2 border-union bg-union/[0.03] px-3 py-2.5"
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-union/10">
                      <Layers className="h-3.5 w-3.5 text-union" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{notification.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/50">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleDateString("ko-KR")
                          : ""}
                      </p>

                      {notification.type === "workspace_invitation" && notification.referenceId && (
                        <div className="mt-2 flex gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 bg-union text-xs text-white hover:bg-union/90"
                            disabled={processingIds.has(notification.referenceId)}
                            onClick={(event) => {
                              event.preventDefault();
                              void onAction(notification.referenceId!, "accept");
                            }}
                          >
                            {processingIds.has(notification.referenceId) ? (
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="mr-1 h-3 w-3" />
                            )}
                            수락
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 border-border/60 text-xs"
                            disabled={processingIds.has(notification.referenceId)}
                            onClick={(event) => {
                              event.preventDefault();
                              void onAction(notification.referenceId!, "decline");
                            }}
                          >
                            <X className="mr-1 h-3 w-3" />
                            거절
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {read.length > 0 && unread.length > 0 && <DropdownMenuSeparator />}

              {read.map((notification) => (
                <div key={notification.id} className="px-3 py-2.5 opacity-60">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">{notification.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/50">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleDateString("ko-KR")
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showInviteBanner && (
        <div className="absolute right-0 top-full z-50 mt-1 animate-fade-up">
          <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-union px-3 py-1.5 text-[11px] text-white shadow-lg">
            <Layers className="h-3 w-3 shrink-0" />
            워크스페이스 초대 알림이 있습니다
            <button
              onClick={() => setDismissedInviteSignature(inviteSignature)}
              className="ml-1 hover:opacity-70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="absolute -top-1 right-3 h-2 w-2 rotate-45 bg-union" />
        </div>
      )}
    </div>
  );
}
