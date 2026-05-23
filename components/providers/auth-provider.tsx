"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Publisher } from "@/types/user";

// 세션 만료가 이 값 이내로 남았을 때 안내 토스트.
const EXPIRY_NOTICE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

interface AuthContextType {
  user: Publisher | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string; hasWorkspace?: boolean }>;
  signup: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Publisher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const expiryNoticeShown = useRef(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // 세션 만료 임박 안내 — mount/login 직후 한 번만.
  useEffect(() => {
    if (!user?.expiresAt || expiryNoticeShown.current) return;
    const remaining = new Date(user.expiresAt).getTime() - Date.now();
    if (remaining > 0 && remaining < EXPIRY_NOTICE_THRESHOLD_MS) {
      const hoursLeft = Math.max(1, Math.floor(remaining / (60 * 60 * 1000)));
      toast.warning(
        `세션이 약 ${hoursLeft}시간 후 만료됩니다. 작업을 마치면 다시 로그인해주세요.`,
        { duration: 8000 },
      );
      expiryNoticeShown.current = true;
    }
  }, [user?.expiresAt]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error };
    }

    setUser(data);
    return { success: true, role: data.role, hasWorkspace: data.hasWorkspace };
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; password: string }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, error: result.error };
    }

    setUser(result);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
