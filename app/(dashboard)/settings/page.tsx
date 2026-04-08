"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("설정이 저장되었습니다.");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">설정</h1>
        <p className="text-sm text-muted-foreground mt-1">계정 및 프로필 설정을 관리하세요.</p>
      </div>

      <Card className="animate-fade-up delay-1 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">프로필 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">이름</Label>
            <Input id="name" defaultValue={user?.name} className="h-11 bg-muted/30 border-border/60 focus:border-union" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">이메일</Label>
            <Input id="email" type="email" defaultValue={user?.email} disabled className="h-11 bg-muted/30 border-border/60" />
            <p className="text-[11px] text-muted-foreground/60">이메일은 변경할 수 없습니다.</p>
          </div>
          <Button onClick={handleSave} className="bg-union text-white hover:bg-union/90">
            저장
          </Button>
        </CardContent>
      </Card>

      <Card className="animate-fade-up delay-2 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-xs uppercase tracking-wider text-muted-foreground">현재 비밀번호</Label>
            <Input id="currentPassword" type="password" className="h-11 bg-muted/30 border-border/60 focus:border-union" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-xs uppercase tracking-wider text-muted-foreground">새 비밀번호</Label>
            <Input id="newPassword" type="password" className="h-11 bg-muted/30 border-border/60 focus:border-union" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword" className="text-xs uppercase tracking-wider text-muted-foreground">새 비밀번호 확인</Label>
            <Input id="confirmNewPassword" type="password" className="h-11 bg-muted/30 border-border/60 focus:border-union" />
          </div>
          <Button onClick={handleSave} variant="outline" className="border-border/60">
            비밀번호 변경
          </Button>
        </CardContent>
      </Card>

      <Card className="animate-fade-up delay-3 border-destructive/30">
        <CardHeader>
          <CardTitle className="heading-display text-sm uppercase tracking-wider text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            위험 영역
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">계정 삭제</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <Separator className="bg-destructive/10" />
          <Button variant="destructive">
            계정 삭제
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
