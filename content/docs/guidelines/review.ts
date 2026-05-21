import type { DocPage } from "../types";

export const review: DocPage = {
  slug: "/docs/guidelines/review",
  title: "심사 기준",
  description:
    "Union 미니앱이 사용자에게 노출되기 전 통과해야 하는 기준입니다. validate가 자동으로 잡는 항목과 수동 심사 항목을 구분합니다.",
  category: "guidelines",
  blocks: [
    {
      type: "callout",
      tone: "warning",
      title: "validate 통과 ≠ 심사 승인",
      body:
        "union validate는 업로드 가능 상태를 보장합니다. 하지만 Warning/Info 항목과 수동 심사 항목은 별도로 검토되므로 validate 통과만으로 승인되지 않습니다. 모든 항목을 사전 점검하세요.",
    },
    {
      type: "text",
      title: "심사 결과 4단계",
      body: [
        "Critical — validate 실패 또는 즉시 반려. 이 단계의 항목이 하나라도 있으면 업로드/승인이 차단됩니다.",
        "Warning — 업로드는 가능하지만 심사관이 수정 요청을 할 수 있습니다. 심사 시간이 길어집니다.",
        "Info — 권장 사항. 단독으로는 반려 사유가 아니지만, 누적되면 품질 점수에 반영됩니다.",
        "Manual — validate가 자동으로 잡지 못해 심사관이 직접 확인합니다. 첫 제출 시 가장 자주 보완 요청받는 영역입니다.",
      ],
    },
    {
      type: "criteria",
      title: "보안",
      items: [
        {
          severity: "critical",
          problem: "eval() 사용",
          detection: "validate",
          rationale: "임의 코드 실행 경로가 됩니다. 사용자 데이터 탈취와 슈퍼앱 환경 손상 가능성이 있습니다.",
          fix: "JSON.parse, 안전한 파서, config 기반 분기로 대체하세요.",
        },
        {
          severity: "critical",
          problem: "new Function() 사용",
          detection: "validate",
          rationale: "eval()과 같은 동적 코드 실행. CSP를 우회합니다.",
          fix: "정적 함수 정의 또는 미리 등록된 핸들러 dispatch 패턴을 사용하세요.",
        },
        {
          severity: "critical",
          problem: "document.cookie 직접 접근",
          detection: "validate",
          rationale: "쿠키는 슈퍼앱과 미니앱 사이의 격리 경계입니다. 미니앱이 직접 만지면 인증 토큰이 새거나 변조됩니다.",
          fix: "Union.storage(앱별 격리) 또는 Union.auth.getAccessToken을 사용하세요.",
        },
        {
          severity: "critical",
          problem: "document.write() 사용",
          detection: "validate",
          rationale: "DOM 전체를 덮어쓸 수 있어 XSS 표면을 만듭니다.",
          fix: "React 렌더링 또는 DOM API(createElement, appendChild)를 사용하세요.",
        },
        {
          severity: "warning",
          problem: ".innerHTML = 할당",
          detection: "validate",
          rationale: "사용자 입력이 섞이면 XSS가 발생합니다.",
          fix: "정적 텍스트는 textContent를, HTML이 꼭 필요한 경우 DOMPurify 같은 검증된 sanitizer로 정화 후 삽입하세요. React 컴포넌트로 다시 쓰는 것이 가장 안전합니다.",
        },
        {
          severity: "warning",
          problem: "window.open() 사용",
          detection: "validate",
          rationale: "WebView 환경에서 새 창은 슈퍼앱 컨텍스트를 벗어납니다.",
          fix: "Union.navigation.push 또는 Union.ui.showModal로 같은 컨텍스트 안에서 처리하세요.",
        },
        {
          severity: "warning",
          problem: "window.location 직접 변경",
          detection: "validate",
          rationale: "WebView 외부로 사용자를 이동시킵니다. 미니앱 종료 의도라면 명시적이어야 합니다.",
          fix: "Union.ui.close()로 미니앱을 닫거나 Union.navigation.replace를 사용하세요.",
        },
        {
          severity: "info",
          problem: "fetch() 직접 호출",
          detection: "validate",
          rationale: "Union 백엔드 호출은 mTLS 인증서가 필요한 엔드포인트가 있습니다.",
          fix: "Union.request()를 사용하세요. mTLS가 자동 적용됩니다.",
        },
        {
          severity: "info",
          problem: "XMLHttpRequest 사용",
          detection: "validate",
          rationale: "fetch()와 같은 이유. 일관성 있게 Union.request로 표준화하세요.",
          fix: "Union.request()를 사용하세요.",
        },
        {
          severity: "info",
          problem: "localStorage 사용",
          detection: "validate",
          rationale: "다른 미니앱과 같은 origin이면 데이터가 섞입니다.",
          fix: "Union.storage(앱별 격리)를 사용하세요.",
        },
        {
          severity: "info",
          problem: "sessionStorage 사용",
          detection: "validate",
          rationale: "localStorage와 같은 이유.",
          fix: "Union.storage를 사용하세요.",
        },
      ],
    },
    {
      type: "criteria",
      title: "완성도",
      items: [
        {
          severity: "warning",
          problem: "placeholder, lorem ipsum, TODO 텍스트가 노출됨",
          detection: "manual",
          rationale: "사용자에게 미완성 인상을 줍니다. 신뢰가 빠르게 깎입니다.",
          fix: "심사 제출 전 모든 자리 표시자 텍스트를 실제 콘텐츠로 교체하세요.",
        },
        {
          severity: "warning",
          problem: "동작하지 않는 버튼/링크가 있음",
          detection: "manual",
          rationale: "기능 누락은 가장 자주 보완 요청받는 사유입니다.",
          fix: "준비 중인 기능은 비활성화 처리(disabled) 또는 '준비 중' 라벨 표시하세요.",
        },
        {
          severity: "warning",
          problem: "빈 상태 UI가 없음",
          detection: "manual",
          rationale: "데이터가 없을 때 빈 화면이 그대로 노출되면 에러로 인식됩니다.",
          fix: "빈 상태마다 안내 문구와 다음 행동(예: 만들기 버튼)을 제공하세요.",
        },
        {
          severity: "warning",
          problem: "에러 상태 처리가 없음",
          detection: "manual",
          rationale: "네트워크 실패, 권한 거부, 만료된 세션을 무시하면 미니앱이 멈춘 것처럼 보입니다.",
          fix: "try/catch와 재시도 버튼, 로그인 만료 시 재인증 유도 등 fallback UX를 제공하세요.",
        },
      ],
    },
    {
      type: "criteria",
      title: "메타데이터와 권한",
      items: [
        {
          severity: "warning",
          problem: "union.config.json의 description이 모호함",
          detection: "manual",
          rationale: "사용자가 미니앱 카드만 보고 무엇을 하는지 알 수 없습니다.",
          fix: "한두 문장으로 핵심 가치와 사용 시점을 명시하세요.",
        },
        {
          severity: "warning",
          problem: "사용하지 않는 권한이 선언되어 있음",
          detection: "manual",
          rationale: "사용자에게 불필요한 권한 동의를 요구하면 거부율이 올라갑니다.",
          fix: "permissions 배열에서 실제로 호출하는 권한만 남기세요.",
        },
        {
          severity: "warning",
          problem: "권한 사용 사유가 명시되지 않음",
          detection: "manual",
          rationale: "사용자/심사자가 왜 필요한지 알 수 없습니다.",
          fix: "description 또는 첫 화면에서 권한 사용 사유를 한 문장으로 설명하세요.",
        },
        {
          severity: "warning",
          problem: "icon이 누락되었거나 저해상도임",
          detection: "manual",
          rationale: "슈퍼앱 카드에 노출되는 첫 인상입니다.",
          fix: "1024x1024 PNG 이상을 권장합니다.",
        },
      ],
    },
    {
      type: "criteria",
      title: "콘텐츠 적합성",
      items: [
        {
          severity: "critical",
          problem: "음란물, 폭력, 차별, 혐오 표현 포함",
          detection: "manual",
          rationale: "Union은 대학생 커뮤니티 슈퍼앱입니다. 즉시 반려 사유.",
          fix: "콘텐츠 적합성 가이드라인에 맞춰 수정하세요.",
        },
        {
          severity: "warning",
          problem: "Union/슈퍼앱 브랜드를 사칭하거나 혼동을 일으킴",
          detection: "manual",
          rationale: "사용자가 Union 공식 기능과 미니앱을 혼동하면 신뢰 문제가 생깁니다.",
          fix: "Union 로고/브랜드 색상을 미니앱 메인 식별자로 사용하지 마세요.",
        },
      ],
    },
    {
      type: "text",
      title: "참고한 외부 기준",
      body: [
        "Union 미니앱 심사 기준은 주요 앱 마켓의 보편적 안전성, 완성도, 개인정보 보호 원칙(예: Apple App Review Guidelines, Google Play Policies)을 참고해 Union WebView 환경에 맞게 재정의했습니다. 본 문서의 항목은 Union의 자체 심사 기준이며, 외부 마켓의 정책을 그대로 적용하지 않습니다.",
      ],
    },
  ],
};
