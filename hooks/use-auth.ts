"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import { toast } from "sonner";

export function useAuthActions() {
  const { user, isLoading, login, signup, logout } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.role === "ROLE_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
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
    contactEmail: string;
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    try {
      const result = await signup(data);
      if (result.success) {
        router.push("/");
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
