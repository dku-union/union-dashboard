"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import { toast } from "sonner";

// 외부 도메인 리다이렉트(open redirect) 차단을 위한 내부 경로 검증.
function isSafeInternalPath(value: string | null): value is string {
  if (!value) return false;
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  return true;
}

export function useAuthActions() {
  const { user, isLoading, login, signup, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        const from = searchParams.get("from");
        if (isSafeInternalPath(from)) {
          router.push(from);
          return true;
        }
        if (result.role === "ROLE_ADMIN") {
          router.push("/admin");
        } else if (result.hasWorkspace === false) {
          router.push("/workspace/new");
        } else {
          router.push("/dashboard");
        }
        return true;
      }
      toast.error(result.error || "로그인에 실패했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    try {
      const result = await signup(data);
      if (result.success) {
        router.push("/workspace/new");
        return true;
      }
      toast.error(result.error || "회원가입에 실패했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return {
    user,
    isLoading,
    isSubmitting,
    handleLogin,
    handleSignup,
    handleLogout,
  };
}
