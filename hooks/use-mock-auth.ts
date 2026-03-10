"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";

export function useMockAuth() {
  const { user, isLoading, login, signup, logout } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push("/");
      }
      return success;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: {
    name: string;
    organization: string;
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    try {
      const success = await signup(data);
      if (success) {
        router.push("/verify-email");
      }
      return success;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
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
