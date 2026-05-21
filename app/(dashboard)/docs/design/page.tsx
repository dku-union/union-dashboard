"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const principleSections = [
  {
    title: "1. 미니앱 UI 원칙",
    items: [
      {
        subtitle: "슈퍼앱 안의 기능 화면처럼 설계",
        desc: "미니앱은 별도 웹사이트가 아니라 Union 앱 안에서 실행되는 기능입니다. 첫 화면은 소개 페이지보다 사용자가 바로 행동할 수 있는 핵심 화면을 우선하세요.",
      },
      {
        subtitle: "모바일 우선",
        desc: "기본 기준은 세로형 모바일 화면입니다. 360px 폭에서도 주요 CTA, 입력값, 상태 메시지가 잘리지 않아야 합니다.",
      },
      {
        subtitle: "상태를 명확히 표시",
        desc: "로딩, 빈 상태, 오류, 권한 거부, 제출 완료 상태를 각각 준비하세요. 네트워크 실패 시 다시 시도할 수 있는 버튼을 제공하는 것을 권장합니다.",
      },
    ],
  },
  {
    title: "2. 레이아웃과 내비게이션",
    items: [
      {
        subtitle: "안전 영역 고려",
        desc: "iOS WebView에서 상단/하단 safe area와 홈 인디케이터 영역을 침범하지 않도록 여백을 확보하세요.",
      },
      {
        subtitle: "고정 CTA는 한 화면에 하나만",
        desc: "결제, 신청, 제출처럼 중요한 액션은 하단 고정 버튼으로 배치할 수 있습니다. 여러 개의 주요 버튼을 동시에 강조하지 마세요.",
      },
      {
        subtitle: "뒤로가기 흐름 유지",
        desc: "Union 앱의 기본 뒤로가기와 충돌하는 커스텀 내비게이션을 피하세요. 모달을 사용하는 경우 닫기 액션을 명확히 제공하세요.",
      },
    ],
  },
  {
    title: "3. 입력과 터치 영역",
    items: [
      {
        subtitle: "터치 타깃 최소 44x44px",
        desc: "버튼, 체크박스, 탭, 아이콘 버튼은 손가락으로 누르기 쉬운 크기를 유지하세요. 인접한 터치 요소 사이에는 충분한 간격을 둡니다.",
      },
      {
        subtitle: "폼 검증은 입력 위치 근처에 표시",
        desc: "필수값 누락, 형식 오류, 서버 검증 실패는 사용자가 수정해야 하는 필드 근처에 표시하세요.",
      },
      {
        subtitle: "제출 중 중복 액션 방지",
        desc: "제출 API 호출 중에는 버튼을 비활성화하고 로딩 상태를 표시하세요. 성공/실패 후 다음 행동을 명확히 안내해야 합니다.",
      },
    ],
  },
];

const checklist = [
  "360px 폭에서 텍스트와 버튼이 잘리지 않음",
  "모든 주요 액션에 로딩/성공/실패 상태가 있음",
  "권한 요청 전에 필요한 이유를 화면에서 이해할 수 있음",
  "이미지와 아이콘이 깨지지 않고 용량이 과도하지 않음",
  "뒤로가기, 닫기, 재시도 흐름이 막히지 않음",
  "개인정보 또는 민감 정보가 불필요하게 노출되지 않음",
];

export default function DesignGuidelinesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
        <div className="animate-fade-up">
          <h1 className="heading-display text-2xl tracking-tight">디자인 가이드라인</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Union 앱 안에서 자연스럽게 동작하는 미니앱을 만들기 위한 UI/UX 기준
          </p>
        </div>

        {principleSections.map((section, index) => (
          <Card key={section.title} className={`animate-fade-up delay-${index + 1} border-border/60`}>
            <CardHeader>
              <CardTitle className="heading-display text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {section.items.map((item, itemIndex) => (
                <div key={item.subtitle}>
                  {itemIndex > 0 && <Separator className="bg-border/40 mb-4" />}
                  <h4 className="font-semibold mb-1">{item.subtitle}</h4>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card className="animate-fade-up delay-4 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">4. 색상과 타이포그래피</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div>
              <p className="text-muted-foreground mb-4">
                서비스 브랜드 색상은 강조 영역에만 사용하고, 본문/입력/상태 영역은 충분한 대비를 유지하세요.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { color: "bg-[#1A1A2E]", label: "Primary" },
                  { color: "bg-[#E8453C]", label: "Error / Critical" },
                  { color: "bg-[#D4A843]", label: "Warning" },
                  { color: "bg-[#22C55E]", label: "Success" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className={`h-14 rounded-lg ${item.color} shadow-sm`} />
                    <p className="text-[11px] text-center text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="bg-border/40" />
            <ul className="space-y-1.5 text-muted-foreground">
              {[
                "제목: 18-22px, 600-700 weight",
                "섹션 제목: 16-18px, 600 weight",
                "본문: 14-16px, 400-500 weight",
                "캡션과 보조 설명: 12-13px, 400 weight",
                "줄간격은 본문 기준 1.45 이상 권장",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-union shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-5 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">5. 아이콘, 이미지, 패키지 에셋</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "앱 아이콘", value: "512x512px PNG, 투명 배경 지양" },
                { label: "스토어 이미지", value: "9:16 비율 권장, 실제 화면 중심" },
                { label: "인앱 이미지", value: "WebP 우선, 필요한 해상도만 포함" },
                { label: "아이콘 스타일", value: "라인 아이콘 또는 시스템 아이콘 사용" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border/60 p-3">
                  <Badge variant="outline" className="mb-2 text-[10px]">
                    {item.label}
                  </Badge>
                  <p className="text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              심사 화면에 노출되는 아이콘과 스크린샷은 실제 미니앱 기능을 확인할 수 있어야 합니다. 장식용 이미지나 흐릿한 배경 이미지만으로 구성된 스크린샷은 피하세요.
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-6 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">6. 심사 전 체크리스트</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 rounded-full bg-union shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
