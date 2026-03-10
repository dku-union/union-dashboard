"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DesignGuidelinesPage() {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-56 shrink-0 lg:block animate-slide-in-left">
        <DocSidebar />
      </aside>
      <div className="flex-1 space-y-6 max-w-3xl">
        <div className="animate-fade-up">
          <h1 className="heading-display text-2xl tracking-tight">디자인 가이드라인</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Union 플랫폼에서 일관된 사용자 경험을 제공하기 위한 디자인 원칙
          </p>
          <div className="h-0.5 w-8 bg-union mt-3" />
        </div>

        {[
          {
            title: "1. 디자인 원칙",
            items: [
              { subtitle: "일관성 (Consistency)", desc: "Union 플랫폼의 전체적인 디자인 언어와 일관된 UI를 유지하세요. 사용자가 미니앱 간 전환 시 자연스러운 경험을 제공합니다." },
              { subtitle: "접근성 (Accessibility)", desc: "충분한 색상 대비, 적절한 터치 영역(최소 44x44px), 의미 있는 레이블을 사용하여 모든 사용자가 앱을 쉽게 사용할 수 있도록 하세요." },
              { subtitle: "반응성 (Responsiveness)", desc: "다양한 화면 크기에서 최적의 레이아웃을 제공하세요. 모바일 우선(Mobile-first) 접근 방식을 권장합니다." },
            ],
          },
          {
            title: "2. 색상 시스템",
            content: (
              <>
                <p className="text-sm text-muted-foreground mb-4">Union의 기본 색상 시스템을 활용하되, 브랜드 색상은 강조(accent) 용도로만 사용하세요.</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { color: "bg-[#1A1A2E]", label: "Primary" },
                    { color: "bg-[#E8453C]", label: "Vermillion" },
                    { color: "bg-[#D4A843]", label: "Gold" },
                    { color: "bg-[#22C55E]", label: "Sage" },
                  ].map((c) => (
                    <div key={c.label} className="space-y-1.5">
                      <div className={`h-14 rounded-lg ${c.color} shadow-sm`} />
                      <p className="text-[11px] text-center text-muted-foreground">{c.label}</p>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
          {
            title: "3. 타이포그래피",
            list: [
              "제목: 16-20px, Bold",
              "본문: 14-16px, Regular",
              "캡션: 12px, Regular",
              "줄간격: 1.5 권장",
            ],
            preContent: "시스템 기본 폰트를 사용하세요. 커스텀 폰트는 로딩 성능에 영향을 줄 수 있습니다.",
          },
          {
            title: "4. 아이콘 & 이미지",
            list: [
              "앱 아이콘: 512x512px, PNG, 둥근 모서리(20% 반경)",
              "스크린샷: 1080x1920px (9:16 비율) 권장",
              "인앱 아이콘: Lucide Icons 또는 유사한 라인 아이콘 세트 사용 권장",
              "이미지 최적화: WebP 형식 권장, 적절한 압축 적용",
            ],
          },
        ].map((section, i) => (
          <Card key={section.title} className={`animate-fade-up delay-${i + 1} border-border/60`}>
            <CardHeader>
              <CardTitle className="heading-display text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {"items" in section && section.items?.map((item, j) => (
                <div key={j}>
                  {j > 0 && <Separator className="bg-border/40 mb-4" />}
                  <h4 className="font-semibold mb-1">{item.subtitle}</h4>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
              {"content" in section && section.content}
              {"preContent" in section && <p className="text-muted-foreground">{section.preContent}</p>}
              {"list" in section && (
                <ul className="space-y-1.5 text-muted-foreground">
                  {section.list?.map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-union shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
