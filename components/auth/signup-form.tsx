"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "@/lib/validations";
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
import { Loader2, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function SignupForm() {
  const { handleSignup, isSubmitting } = useAuthActions();
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const email = form.watch("email");

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // 이메일 변경 시 인증 상태 초기화
  const resetVerification = useCallback(() => {
    setEmailVerified(false);
    setCodeSent(false);
    setVerifyCode("");
  }, []);

  useEffect(() => {
    resetVerification();
  }, [email, resetVerification]);

  const handleSendCode = async () => {
    const emailValue = form.getValues("email");
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      toast.error("유효한 이메일을 입력해주세요.");
      return;
    }

    setSendingCode(true);
    try {
      const res = await fetch("/api/auth/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setCodeSent(true);
      setCooldown(60);
      toast.success("인증 코드가 발송되었습니다.");
    } catch {
      toast.error("인증 코드 발송에 실패했습니다.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verifyCode.length !== 6) {
      toast.error("6자리 인증 코드를 입력해주세요.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/auth/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.getValues("email"), code: verifyCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setEmailVerified(true);
      toast.success("이메일 인증이 완료되었습니다.");
    } catch {
      toast.error("인증 확인에 실패했습니다.");
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    if (!emailVerified) {
      toast.error("이메일 인증을 먼저 완료해주세요.");
      return;
    }
    await handleSignup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-foreground/[0.03] backdrop-blur-sm bg-card/80">
      <CardContent className="pt-8 pb-0">
        <div className="text-center mb-6 animate-fade-up">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-union text-white heading-display text-lg">
              U
            </div>
          </div>
          <h1 className="heading-display text-xl tracking-tight mt-3">회원가입</h1>
          <p className="text-xs text-muted-foreground mt-1">
            퍼블리셔 계정을 만들어 미니앱을 등록하세요
          </p>
        </div>
      </CardContent>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 이름 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="animate-fade-up delay-1">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">이름</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="홍길동"
                      className="h-11 bg-muted/50 border-border/60 focus:border-union focus:ring-union/20 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이메일 + 인증 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="animate-fade-up delay-2">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">이메일</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="developer@dankook.ac.kr"
                        className="h-11 bg-muted/50 border-border/60 focus:border-union focus:ring-union/20 transition-colors"
                        disabled={emailVerified}
                        {...field}
                      />
                    </FormControl>
                    {!emailVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 shrink-0 border-border/60"
                        onClick={handleSendCode}
                        disabled={sendingCode || cooldown > 0}
                      >
                        {sendingCode ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : cooldown > 0 ? (
                          `${cooldown}초`
                        ) : (
                          <><Mail className="h-4 w-4 mr-1" />인증</>
                        )}
                      </Button>
                    )}
                    {emailVerified && (
                      <div className="flex items-center h-11 px-3 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 인증 코드 입력 */}
            {codeSent && !emailVerified && (
              <div className="animate-fade-up space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">인증 코드</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6자리 코드 입력"
                    className="h-11 bg-muted/50 border-border/60 focus:border-union focus:ring-union/20 transition-colors tracking-widest text-center"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                  />
                  <Button
                    type="button"
                    className="h-11 shrink-0 bg-union text-white hover:bg-union/90"
                    onClick={handleVerifyCode}
                    disabled={verifying || verifyCode.length !== 6}
                  >
                    {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "확인"}
                  </Button>
                </div>
              </div>
            )}

            {/* 비밀번호 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="animate-fade-up delay-3">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="영문, 숫자, 특수문자 포함 10자 이상"
                      className="h-11 bg-muted/50 border-border/60 focus:border-union focus:ring-union/20 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 비밀번호 확인 */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="animate-fade-up delay-4">
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
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
              className="animate-fade-up delay-5 w-full h-11 bg-union text-white hover:bg-union/90 transition-all group mt-2"
              disabled={isSubmitting || !emailVerified}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  회원가입
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center pt-2 pb-6">
        <p className="text-sm text-muted-foreground animate-fade-up delay-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-union hover:text-union/80 font-medium transition-colors">
            로그인
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
