"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, LoginFormValues } from "@/lib/validations";
import { useAuthActions } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const { handleLogin, isSubmitting } = useAuthActions();
  const searchParams = useSearchParams();
  const expiredNoticeShown = useRef(false);

  useEffect(() => {
    if (expiredNoticeShown.current) return;
    if (searchParams.get("expired") === "1") {
      toast.info("세션이 만료되어 다시 로그인이 필요합니다.");
      expiredNoticeShown.current = true;
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin(data.email, data.password, {
      redirectTo: searchParams.get("from"),
    });
  };

  return (
    <div className="px-2">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center">
          <Image src="/logo.svg" alt="Union" width={44} height={44} />
        </div>
        <h1 className="heading-display text-2xl tracking-tight mt-4">Union</h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-wide">
          Publisher Dashboard
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">이메일</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="developer@dankook.ac.kr"
                    className="h-11 bg-background border-border/60 focus:border-union focus:ring-union/20 transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 bg-background border-border/60 focus:border-union focus:ring-union/20 transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-11 bg-union text-white hover:bg-union/90 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "로그인"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-8">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-union hover:text-union/80 font-medium transition-colors">
          회원가입
        </Link>
      </p>
    </div>
  );
}
