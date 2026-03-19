"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AppWindow, ClipboardCheck, Shield } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "퍼블리셔", value: "-", icon: Users, color: "text-foreground", bg: "bg-gradient-to-br from-foreground/5 to-foreground/[0.02]" },
    { label: "전체 앱", value: "-", icon: AppWindow, color: "text-sage", bg: "bg-gradient-to-br from-sage/10 to-sage/5" },
    { label: "심사 대기", value: "-", icon: ClipboardCheck, color: "text-gold", bg: "bg-gradient-to-br from-gold/10 to-gold/5" },
    { label: "정지 계정", value: "-", icon: Shield, color: "text-destructive", bg: "bg-gradient-to-br from-destructive/10 to-destructive/5" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="animate-fade-up">
        <h1 className="heading-display text-3xl tracking-tight">
          관리자 대시보드
        </h1>
        <p className="text-muted-foreground mt-1">
          안녕하세요, {user?.name}님. Union 플랫폼 관리 현황입니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} className={`card-hover animate-fade-up delay-${i + 1} border-border/60`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {stat.label}
                  </p>
                  <p className="heading-display text-3xl">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-fade-up delay-5 border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
            관리 기능
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            퍼블리셔 관리, 앱 심사 등의 상세 기능은 이후 Phase에서 구현됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
