"use client";

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
import { Loader2, ArrowRight } from "lucide-react";

export function SignupForm() {
  const { handleSignup, isSubmitting } = useAuthActions();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    await handleSignup({
      name: data.name,
      contactEmail: data.contactEmail ?? "",
      email: data.email,
      password: data.password,
    });
  };

  const fields = [
    { name: "name" as const, label: "이름", placeholder: "홍길동", type: "text" },
    { name: "contactEmail" as const, label: "연락 이메일", placeholder: "contact@example.com", type: "email" },
    { name: "email" as const, label: "이메일", placeholder: "developer@dankook.ac.kr", type: "email" },
    { name: "password" as const, label: "비밀번호", placeholder: "영문, 숫자 포함 8자 이상", type: "password" },
    { name: "confirmPassword" as const, label: "비밀번호 확인", placeholder: "비밀번호를 다시 입력하세요", type: "password" },
  ];

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
            {fields.map((f, i) => (
              <FormField
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem className={`animate-fade-up delay-${i + 1}`}>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={f.type}
                        placeholder={f.placeholder}
                        className="h-11 bg-muted/50 border-border/60 focus:border-union focus:ring-union/20 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="submit"
              className="animate-fade-up delay-6 w-full h-11 bg-union text-white hover:bg-union/90 transition-all group mt-2"
              disabled={isSubmitting}
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
        <p className="text-sm text-muted-foreground animate-fade-up delay-7">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-union hover:text-union/80 font-medium transition-colors">
            로그인
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
