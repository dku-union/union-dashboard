"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EmailVerificationNotice() {
  return (
    <Card className="border-border/60 shadow-xl shadow-foreground/[0.03] backdrop-blur-sm bg-card/80">
      <CardHeader className="text-center pb-2 pt-8">
        <div className="mx-auto mb-5 relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-union/10 animate-scale-in">
            <MailCheck className="h-10 w-10 text-union" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sage animate-pulse" />
        </div>
        <h2 className="heading-display text-xl animate-fade-up delay-1">
          인증 이메일이 발송되었습니다
        </h2>
      </CardHeader>
      <CardContent className="space-y-5 text-center pb-8">
        <p className="text-sm text-muted-foreground leading-relaxed animate-fade-up delay-2">
          입력하신 이메일 주소로 인증 링크를 발송했습니다.
          <br />
          이메일을 확인하여 계정 인증을 완료해주세요.
        </p>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        <p className="text-xs text-muted-foreground/70 animate-fade-up delay-3">
          이메일을 받지 못하셨나요? 스팸 폴더를 확인하거나 잠시 후 다시 시도해주세요.
        </p>
        <Button
          variant="outline"
          className="w-full h-11 animate-fade-up delay-4 group border-border/60"
          render={<Link href="/login" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          로그인 페이지로 돌아가기
        </Button>
      </CardContent>
    </Card>
  );
}
