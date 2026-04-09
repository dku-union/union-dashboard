"use client";

import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">신고 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          신고 도메인은 별도 데이터 모델 설계 후 실데이터로 연결할 예정입니다.
        </p>
      </div>
      <Card className="border-dashed border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-lg">준비 중</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            신고 대상 종류, 신고 이력, 관리자 조치 모델이 아직 정의되지 않았습니다. 1차 admin 실데이터 전환 범위에서는 제외합니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
