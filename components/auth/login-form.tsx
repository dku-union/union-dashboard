"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validations";
import { useAuthActions } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";

export function LoginForm() {
  const { handleLogin, isSubmitting } = useAuthActions();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin(data.email, data.password);
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-foreground/[0.03] backdrop-blur-sm bg-card/80">
      <CardContent className="pt-8 pb-4">
        {/* Union Logo + Name inside the card */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-union text-white heading-display text-lg">
              U
            </div>
          </div>
          <h1 className="heading-display text-xl tracking-tight mt-3">Union</h1>
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
                <FormItem className="animate-fade-up delay-1">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">이메일</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="developer@dankook.ac.kr"
                      className="h-11 bg-muted/50 border-border/60 focus:border-union focus:ring-union/20 transition-colors"
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
                <FormItem className="animate-fade-up delay-2">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 bg-muted/50 border-border/60 focus:border-union focus:ring-union/20 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="animate-fade-up delay-3 w-full h-11 bg-union text-white hover:bg-union/90 transition-all group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  로그인
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center pt-2 pb-6">
        <p className="text-sm text-muted-foreground animate-fade-up delay-4">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-union hover:text-union/80 font-medium transition-colors">
            회원가입
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
