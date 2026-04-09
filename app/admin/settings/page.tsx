"use client";

import { toast } from "sonner";
import { AlertTriangle, Shield } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("관리자 설정 저장은 준비 중입니다.");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">관리자 설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          관리자 프로필과 보안 관련 설정을 확인합니다.
        </p>
        <div className="mt-3 h-0.5 w-8 bg-union" />
      </div>

      <Card className="animate-fade-up delay-1 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
            <Shield className="h-4 w-4" />
            관리자 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name" className="text-xs uppercase tracking-wider text-muted-foreground">
              이름
            </Label>
            <Input
              id="admin-name"
              defaultValue={user?.name}
              className="h-11 border-border/60 bg-muted/30 focus:border-union"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-xs uppercase tracking-wider text-muted-foreground">
              이메일
            </Label>
            <Input
              id="admin-email"
              defaultValue={user?.email}
              disabled
              className="h-11 border-border/60 bg-muted/30"
            />
          </div>
          <Button onClick={handleSave} className="bg-union text-white hover:bg-union/90">
            저장
          </Button>
        </CardContent>
      </Card>

      <Card className="animate-fade-up delay-2 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
            비밀번호 변경
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-xs uppercase tracking-wider text-muted-foreground">
              현재 비밀번호
            </Label>
            <Input id="current-password" type="password" className="h-11 border-border/60 bg-muted/30 focus:border-union" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-xs uppercase tracking-wider text-muted-foreground">
              새 비밀번호
            </Label>
            <Input id="new-password" type="password" className="h-11 border-border/60 bg-muted/30 focus:border-union" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-xs uppercase tracking-wider text-muted-foreground">
              새 비밀번호 확인
            </Label>
            <Input id="confirm-password" type="password" className="h-11 border-border/60 bg-muted/30 focus:border-union" />
          </div>
          <Button onClick={handleSave} variant="outline" className="border-border/60">
            비밀번호 변경
          </Button>
        </CardContent>
      </Card>

      <Card className="animate-fade-up delay-3 border-destructive/30">
        <CardHeader>
          <CardTitle className="heading-display flex items-center gap-2 text-sm uppercase tracking-wider text-destructive">
            <AlertTriangle className="h-4 w-4" />
            위험 영역
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">관리자 세션 초기화</p>
            <p className="mt-1 text-sm text-muted-foreground">
              공용 장비를 사용하는 경우 모든 관리자 세션을 재확인하도록 유도하는 용도의 기능입니다.
            </p>
          </div>
          <Separator className="bg-destructive/10" />
          <Button variant="destructive" onClick={handleSave}>
            모든 세션 로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
