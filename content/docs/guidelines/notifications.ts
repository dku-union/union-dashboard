import type { DocPage } from "../types";

export const notifications: DocPage = {
  slug: "/docs/guidelines/notifications",
  title: "알림 발송 가이드",
  description:
    "Publisher 가 Union 미니앱 구독자에게 푸시 알림을 발송하는 전체 흐름입니다. API 키 발급부터 페이로드 작성, 딥링크 라우팅, 미니앱 측 이벤트 수신까지 다룹니다.",
  category: "guidelines",
  blocks: [
    {
      type: "callout",
      tone: "info",
      title: "보안 모델",
      body:
        "원격 푸시 발송은 publisher 백엔드 → Union 서버 경로만 허용됩니다. 미니앱(WebView) JS 에서 직접 발송할 수 없습니다 — API Key 가 사용자 브라우저에 노출되기 때문입니다. SDK 의 Union.notification 은 권한 요청 / 로컬 알림 / 구독 토글 / 수신 이벤트 만 다룹니다.",
    },

    {
      type: "text",
      title: "전체 흐름",
      body: [
        "1. Dashboard → 앱 상세 → API 키 → 새 키 발급 (raw key 는 발급 직후 1회만 노출).",
        "2. publisher 의 백엔드 서버 환경변수에 raw key 를 안전하게 보관.",
        "3. 백엔드에서 POST /api/v1/publishers/notifications 를 X-Union-Api-Key 헤더로 호출.",
        "4. Union 서버가 미니앱 구독자(자동 + 명시적) 에게 APNs 로 발송. NotificationCampaign 과 NotificationInbox 가 DB 에 기록됨.",
        "5. iOS 디바이스가 알림 수신 → 사용자 탭 → Union 앱이 deeplinkType 에 따라 라우팅 → 미니앱 SDK 의 Union.notification.onReceived 콜백 호출.",
      ],
    },

    {
      type: "steps",
      title: "1) API 키 발급",
      items: [
        {
          title: "Dashboard 에서 앱 상세로 이동",
          body: "발송하려는 미니앱의 상세 화면(/apps/{id})으로 진입한 뒤 헤더의 'API 키' 버튼을 누르거나, 사이드바의 '현재 앱 → API 키' 메뉴를 사용합니다.",
        },
        {
          title: "키 이름을 정하고 발급",
          body: "이름은 사용처를 알아볼 수 있게 짓습니다. 예: production-server, staging, ci-tests. 한 publisher 는 N 개 키를 가질 수 있습니다.",
        },
        {
          title: "raw key 를 안전한 곳에 즉시 복사",
          body: "발급 직후 모달에 노출되는 uk_live_ 로 시작하는 40 자 문자열이 raw key 입니다. 모달을 닫으면 DB 에는 SHA-256 해시만 남아 다시 볼 수 없습니다. 환경변수(Secret Manager, GitHub Encrypted Secrets 등)에 저장하세요.",
        },
        {
          title: "키 폐기",
          body: "노출되었거나 더 이상 쓰지 않는 키는 같은 화면의 '폐기' 버튼으로 무효화합니다. 폐기 후 동일 키 재사용 시 401 이 반환됩니다.",
        },
      ],
    },

    {
      type: "callout",
      tone: "warning",
      title: "API Key 를 절대 노출하지 마세요",
      body:
        "프론트엔드 코드, public Git 리포, Slack/Discord, 미니앱 번들 어디에도 raw key 를 두면 안 됩니다. 노출 의심이 들면 즉시 폐기하고 새 키를 발급하세요. 다른 publisher 미니앱에 발송 시도하면 자동으로 403 이 반환되지만, 본인 미니앱 사용자에게 스팸을 보낼 수는 있으므로 키 관리는 publisher 책임입니다.",
    },

    {
      type: "steps",
      title: "2) 발송 호출 (curl)",
      items: [
        {
          title: "최소 페이로드로 발송",
          code: {
            language: "bash",
            content: `curl -X POST https://union-api-183092809276.asia-northeast3.run.app/api/v1/publishers/notifications \\
  -H "X-Union-Api-Key: uk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetAppId": "com.union.soccer",
    "title": "주말 경기 일정 공지",
    "body": "토요일 14시 운동장 집합",
    "category": "ANNOUNCEMENT"
  }'`,
          },
        },
        {
          title: "딥링크 포함 발송 (미니앱 내부 경로)",
          code: {
            language: "bash",
            content: `curl -X POST https://union-api-183092809276.asia-northeast3.run.app/api/v1/publishers/notifications \\
  -H "X-Union-Api-Key: uk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetAppId": "com.union.soccer",
    "title": "예약하신 경기가 곧 시작합니다",
    "body": "10분 후 시작 — 출석 체크해주세요",
    "category": "UPDATE",
    "deeplinkType": "MINIAPP",
    "targetPath": "/matches/12345/attendance"
  }'`,
          },
        },
        {
          title: "외부 웹 URL 로 라우팅",
          code: {
            language: "bash",
            content: `curl -X POST https://union-api-183092809276.asia-northeast3.run.app/api/v1/publishers/notifications \\
  -H "X-Union-Api-Key: uk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetAppId": "com.union.soccer",
    "title": "신규 후원사 안내",
    "body": "자세한 내용을 확인해주세요",
    "category": "ANNOUNCEMENT",
    "deeplinkType": "WEB",
    "targetWebUrl": "https://soccer-club.example.com/sponsors/2026"
  }'`,
          },
        },
      ],
    },

    {
      type: "text",
      title: "요청 페이로드 필드",
      body: [
        "targetAppId (필수, string) — reverse-domain 미니앱 ID. union.config.json 의 appId 와 동일.",
        "title (필수, string ≤ 120자) — 알림 헤드라인. iOS 잠금화면에서 한 줄로 잘립니다.",
        "body (필수, string ≤ 500자) — 본문. iOS 는 3~4줄로 펼쳐서 표시.",
        "category (필수) — ANNOUNCEMENT / UPDATE / RECOMMENDATION / MINIAPP_GENERIC. 카테고리는 사용자가 알림 종류별 토글에 사용합니다.",
        "deeplinkType (선택, default NONE) — NONE / MINIAPP / WEB / INTERNAL. 사용자가 알림을 탭했을 때의 동작을 결정.",
        "targetPath (선택) — deeplinkType=MINIAPP 일 때 미니앱 내부 경로. 예: /matches/12345.",
        "targetWebUrl (선택) — deeplinkType=WEB 일 때 외부 Safari 로 열 URL.",
        "targetInternalRoute (선택) — deeplinkType=INTERNAL 일 때 Union 내부 라우트(예: '/notifications/inbox'). 일반 publisher 가 쓸 일은 드뭅니다.",
        "imageUrl (선택) — 알림에 큰 이미지를 노출. APNs Media 첨부. HTTPS 필수.",
      ],
    },

    {
      type: "text",
      title: "응답 페이로드",
      body: [
        "campaignId (number) — 발송된 NotificationCampaign 의 PK. 추후 발송 이력 / 통계 조회의 키.",
        "subscriberCount (number) — 이 미니앱을 구독한 사용자 중 푸시 활성 상태인 사용자 수.",
        "sentTokenCount (number) — 실제로 APNs 로 보낸 디바이스 토큰 수. 한 사용자가 여러 디바이스를 가지면 subscriberCount 보다 클 수 있습니다.",
      ],
    },

    {
      type: "code",
      title: "Node.js / TypeScript 예시",
      language: "typescript",
      code: `const API_KEY = process.env.UNION_API_KEY!;
const BASE = "https://union-api-183092809276.asia-northeast3.run.app";

async function sendNotification(options: {
  targetAppId: string;
  title: string;
  body: string;
  category: "ANNOUNCEMENT" | "UPDATE" | "RECOMMENDATION" | "MINIAPP_GENERIC";
  deeplinkType?: "NONE" | "MINIAPP" | "WEB" | "INTERNAL";
  targetPath?: string;
  targetWebUrl?: string;
}) {
  const res = await fetch(\`\${BASE}/api/v1/publishers/notifications\`, {
    method: "POST",
    headers: {
      "X-Union-Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(\`발송 실패 (\${res.status}): \${error}\`);
  }
  return res.json() as Promise<{
    campaignId: number;
    subscriberCount: number;
    sentTokenCount: number;
  }>;
}

// 사용 예
await sendNotification({
  targetAppId: "com.union.soccer",
  title: "주말 경기 일정 공지",
  body: "토요일 14시 운동장 집합",
  category: "ANNOUNCEMENT",
  deeplinkType: "MINIAPP",
  targetPath: "/matches/12345",
});`,
    },

    {
      type: "code",
      title: "Python 예시",
      language: "python",
      code: `import os
import requests

API_KEY = os.environ["UNION_API_KEY"]
BASE = "https://union-api-183092809276.asia-northeast3.run.app"

def send_notification(target_app_id, title, body, category, **deeplink):
    res = requests.post(
        f"{BASE}/api/v1/publishers/notifications",
        headers={
            "X-Union-Api-Key": API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "targetAppId": target_app_id,
            "title": title,
            "body": body,
            "category": category,
            **deeplink,
        },
        timeout=10,
    )
    res.raise_for_status()
    return res.json()

# 사용 예
result = send_notification(
    target_app_id="com.union.soccer",
    title="주말 경기 일정 공지",
    body="토요일 14시 운동장 집합",
    category="ANNOUNCEMENT",
    deeplinkType="MINIAPP",
    targetPath="/matches/12345",
)
print(f"보낸 디바이스: {result['sentTokenCount']}")`,
    },

    {
      type: "text",
      title: "딥링크 타입별 동작 매트릭스",
      body: [
        "NONE — 알림 인박스에만 추가. 사용자가 탭해도 알림 탭으로만 이동.",
        "MINIAPP — targetAppId 의 미니앱을 열고 targetPath 가 있으면 그 경로로 진입. 가장 자주 쓰는 옵션.",
        "WEB — targetWebUrl 을 시스템 Safari 로 외부 오픈. Union 앱 컨텍스트를 벗어남.",
        "INTERNAL — Union 앱의 내부 라우트(예: 알림 설정, 구독 관리 페이지). publisher 보다는 admin 시스템 알림용.",
      ],
    },

    {
      type: "text",
      title: "발송 대상 — '미니앱 구독자' 의 의미",
      body: [
        "사용자가 미니앱을 한 번이라도 실행하면 MiniAppSubscription 이 자동 생성됩니다 (push_enabled=true).",
        "사용자는 알림 설정에서 미니앱별 푸시를 끌 수 있습니다 → push_enabled=false 가 되어 발송 대상에서 제외.",
        "사용자가 명시적으로 unsubscribe 하면 unsubscribed_at 이 채워져 영구 제외 (재실행 시 reactivate).",
        "따라서 'subscriberCount' 는 발송 시점 기준 활성 구독자 수입니다 — 시간에 따라 변동.",
        "다른 publisher 의 미니앱 appId 로 발송 시도하면 403 (워크스페이스 멤버 검증).",
      ],
    },

    {
      type: "steps",
      title: "3) 발송 전 테스트 — Dashboard 테스트 발송 폼",
      items: [
        {
          title: "API Key 없이 본인 디바이스로만 발송",
          body: "앱 상세 → '알림 발송' 메뉴에서 JWT 인증으로 즉시 발송 가능. publisher 백엔드를 구축하기 전 페이로드와 사용자 경험을 빠르게 검증할 때 사용합니다. 본인 미니앱에만 보낼 수 있습니다.",
        },
        {
          title: "iOS 실기기 준비",
          body: "Push 는 시뮬레이터에서 동작하지 않습니다. 실기기에 Union 앱을 설치하고 첫 실행에서 알림 권한을 허용해주세요. 권한이 허용되면 자동으로 APNs 토큰이 등록됩니다.",
        },
        {
          title: "발송 후 확인",
          body: "발송 결과 패널에 campaignId / subscriberCount / sentTokenCount 가 표시됩니다. subscriberCount 가 0 이라면 그 미니앱을 실행한 사용자가 아직 없거나, 사용자가 푸시를 모두 꺼둔 상태입니다.",
        },
      ],
    },

    {
      type: "callout",
      tone: "info",
      title: "사용자 디바이스 첫 등록 시점",
      body:
        "Union 앱은 첫 실행 시 권한 다이얼로그를 띄우고 APNs 등록을 시도합니다. 사용자가 거부했다가 나중에 OS 설정에서 켜는 경우, 다음 앱 실행 시 토큰이 등록됩니다. 즉 발송 직후 sentTokenCount 가 0 이어도 사용자가 한 명도 없는 게 아니라, 권한 허용 + 한 번 더 앱을 열 때까지 기다려야 할 수 있습니다.",
    },

    {
      type: "text",
      title: "4) 미니앱(SDK) 측에서 알림 수신",
      body: [
        "WebView 가 떠 있는 상태에서 알림이 도착하면 SDK 가 'notification:received' 이벤트를 dispatch 합니다.",
        "미니앱은 이 이벤트로 in-app 토스트를 띄우거나 데이터를 refetch 할 수 있습니다.",
        "사용자가 알림을 탭해 미니앱이 deeplinkType=MINIAPP 으로 열리면, targetPath 가 URL query 로 전달됩니다 — React Router 가 자동으로 라우팅합니다.",
      ],
    },

    {
      type: "code",
      title: "SDK 수신 예시",
      language: "typescript",
      code: `import Union from "@union-miniapp/sdk";

// 권한 요청 (앱이 처음 열렸을 때 한 번)
const { granted } = await Union.notification.requestPermission();

// 명시적 구독 토글 UI 가 있다면
if (granted) await Union.notification.subscribe();

// 원격 푸시 수신
const unsubscribe = Union.notification.onReceived((payload) => {
  console.log("알림 도착", payload);
  // payload = {
  //   campaignId: "42",
  //   category: "ANNOUNCEMENT",
  //   deeplinkType: "MINIAPP",
  //   appId: "com.union.soccer",
  //   path: "/matches/12345",
  // }

  // 예: 같은 미니앱이 떠 있는 상태라면 in-app 토스트만
  if (window.location.pathname === payload.path) return;
  showToast({ title: "새 알림", message: payload });
});

// 컴포넌트 unmount 시
// unsubscribe();`,
    },

    {
      type: "code",
      title: "로컬 알림 (보너스 — SDK 단독)",
      language: "typescript",
      code: `// 5초 뒤 발사되는 로컬 알림 — 서버를 거치지 않음.
// 예약 / 타이머 / 운동 인터벌 같은 미니앱에 유용.
await Union.notification.scheduleLocal({
  title: "휴식 끝",
  body: "다음 세트를 시작하세요",
  delaySeconds: 60,
  data: { setIndex: "3" },
});`,
    },

    {
      type: "criteria",
      title: "에러 코드",
      items: [
        {
          severity: "critical",
          problem: "401 INVALID_API_KEY",
          detection: "manual",
          rationale: "X-Union-Api-Key 헤더가 없거나, 폐기된 키이거나, 형식이 잘못됨(uk_live_ prefix 누락).",
          fix: "Dashboard 에서 키 상태를 확인하고 폐기된 경우 새로 발급. raw key 전체를 정확히 전달했는지 점검.",
        },
        {
          severity: "critical",
          problem: "403 SCOPE_INSUFFICIENT 또는 워크스페이스 권한 없음",
          detection: "manual",
          rationale: "key 의 scope 에 notifications:send 가 없거나, targetAppId 가 이 publisher 의 미니앱이 아님.",
          fix: "본인 워크스페이스의 미니앱 appId 를 정확히 입력했는지 확인. 신규 키는 기본적으로 notifications:send 가 부여됩니다.",
        },
        {
          severity: "warning",
          problem: "400 VALIDATION_FAILED",
          detection: "manual",
          rationale: "title/body 가 비어있거나 길이 초과, deeplinkType=MINIAPP 인데 targetPath 가 없는 등 필수 필드 누락.",
          fix: "응답 body 의 error 메시지에 어떤 필드가 문제인지 표시됩니다. 길이 제한(title 120, body 500)을 지키세요.",
        },
        {
          severity: "warning",
          problem: "404 MiniApp을 찾을 수 없습니다",
          detection: "manual",
          rationale: "targetAppId 에 해당하는 미니앱이 시스템에 없거나, 아직 dashboard 에서 등록되지 않음.",
          fix: "미니앱이 dashboard 에 등록되어 있고 union.config.json 의 appId 와 정확히 일치하는지 확인.",
        },
        {
          severity: "info",
          problem: "200 OK 인데 sentTokenCount=0",
          detection: "manual",
          rationale: "구독자가 없거나 모두 푸시 비활성. 에러는 아니지만 알림이 도달하지 않음.",
          fix: "사용자가 미니앱을 한 번이라도 실행했는지 / 알림 권한을 허용했는지 확인. dashboard 의 'subscriberCount' 가 0 이면 사용자 확보가 우선.",
        },
      ],
    },

    {
      type: "checklist",
      title: "발송 전 체크리스트",
      items: [
        {
          id: "key-secured",
          label: "API Key 는 백엔드 환경변수에 저장",
          detail:
            "Secret Manager, GitHub Encrypted Secrets, Vault 등 안전한 곳. 프론트엔드 / git / 슬랙에 절대 노출 금지.",
        },
        {
          id: "app-id-correct",
          label: "targetAppId 가 union.config.json 과 정확히 일치",
          detail: "reverse-domain 형식. 한 글자라도 다르면 404.",
        },
        {
          id: "deeplink-target",
          label: "deeplinkType 과 target 필드 매칭",
          detail:
            "MINIAPP → targetPath, WEB → targetWebUrl. 누락 시 알림은 가지만 탭해도 동작 안 함.",
        },
        {
          id: "test-on-device",
          label: "Dashboard 테스트 발송 폼으로 실기기 수신 확인",
          detail:
            "본격 운영 발송 전 본인 디바이스로 한 번 보내서 텍스트 / 딥링크 / 카테고리가 의도대로 동작하는지 검증.",
        },
        {
          id: "rate-aware",
          label: "발송 빈도 관리",
          detail:
            "사용자가 너무 자주 알림을 받으면 알림 권한을 꺼버립니다. 카테고리별로 빈도 상한을 정해두는 것이 좋습니다.",
        },
        {
          id: "content-respect",
          label: "내용 가이드",
          detail:
            "광고성 메시지는 사용자에게 분명히 가치를 줘야 합니다. 단순 마케팅 푸시는 unsubscribe 율을 높입니다. UPDATE / ANNOUNCEMENT 카테고리를 사용해 사용자가 분류할 수 있게 하세요.",
        },
      ],
    },

    {
      type: "text",
      title: "자주 묻는 질문",
      body: [
        "Q. 한 번에 N 명에게만 발송하고 싶다. → 현재 API 는 '미니앱의 활성 구독자 전체' 발송만 지원합니다. 추후 audience.type=USER_IDS 옵션 추가 예정.",
        "Q. 알림이 오지 않는다. → 1) 사용자가 미니앱을 실행한 적이 있는지, 2) 알림 권한을 허용했는지, 3) APNs Auth Key 가 Firebase 콘솔에 업로드되어 있는지 (운영자 확인) 순으로 점검.",
        "Q. 발송 이력은 어디서 보나? → 현재는 응답의 campaignId 로 DB 의 notification_campaigns 테이블을 조회. 운영 단계에서 dashboard 에 발송 이력 화면이 추가될 예정.",
        "Q. 이미지 알림이 안 나온다. → imageUrl 이 HTTPS 인지 확인. iOS 는 첨부 사이즈가 10MB 를 넘으면 무시합니다. CDN(예: Cloud CDN, ImageKit)으로 압축된 이미지를 권장.",
        "Q. 같은 사용자에게 중복 발송된다. → 사용자가 두 디바이스에 Union 을 설치했을 가능성. sentTokenCount > subscriberCount 인 케이스. 정상 동작입니다.",
      ],
    },
  ],
};
