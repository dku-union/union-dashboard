"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string | null;
  isRead: boolean;
  referenceId: string | null;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    // 30초마다 폴링
    const interval = setInterval(fetch_, 30000);
    return () => clearInterval(interval);
  }, [fetch_]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch {
      // silent
    }
  };

  const handleInvitation = async (invitationId: string, action: "accept" | "decline") => {
    try {
      const res = await fetch(`/api/invitations/${invitationId}?action=${action}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "처리에 실패했습니다.");
        return false;
      }

      toast.success(data.message);
      // 알림 목록 갱신
      await fetch_();
      return true;
    } catch {
      toast.error("처리 중 오류가 발생했습니다.");
      return false;
    }
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    refetch: fetch_,
    markAsRead,
    handleInvitation,
  };
}
