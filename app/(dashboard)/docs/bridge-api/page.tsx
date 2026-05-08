"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { CodeBlock } from "@/components/docs/code-block";
import { ApiEndpoint } from "@/components/docs/api-endpoint";
import { ApiParameterTable } from "@/components/docs/api-parameter-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bridgeApis = [
  {
    method: "AUTH",
    path: "Union.auth.login()",
    description: "Union 앱의 사용자 인증 플로우를 시작하고 authorization code를 반환합니다.",
    permission: null,
    code: `const { code } = await Union.auth.login();`,
    parameters: [
      { name: "반환값.code", type: "string", required: true, description: "서버 교환용 authorization code" },
    ],
  },
  {
    method: "AUTH",
    path: "Union.auth.getUserProfile()",
    description: "현재 로그인한 사용자의 기본 프로필을 조회합니다.",
    permission: "user.profile",
    code: `const profile = await Union.auth.getUserProfile();
// { userId, nickname, profileImage?, university?, email? }`,
    parameters: [
      { name: "반환값.userId", type: "string", required: true, description: "사용자 고유 ID" },
      { name: "반환값.nickname", type: "string", required: true, description: "사용자 닉네임" },
      { name: "반환값.profileImage", type: "string", required: false, description: "프로필 이미지 URL" },
      { name: "반환값.university", type: "string", required: false, description: "user.university 권한이 있을 때 반환" },
      { name: "반환값.email", type: "string", required: false, description: "user.email 권한이 있을 때 반환" },
    ],
  },
  {
    method: "AUTH",
    path: "Union.auth.getAccessToken()",
    description: "미니앱 서버와 통신할 때 사용할 access token을 조회합니다.",
    permission: null,
    code: `const token = await Union.auth.getAccessToken();`,
    parameters: [
      { name: "반환값", type: "string", required: true, description: "Authorization 헤더에 사용할 access token" },
    ],
  },
  {
    method: "UI",
    path: "Union.ui.showToast(options)",
    description: "네이티브 토스트 메시지를 표시합니다.",
    permission: null,
    code: `Union.ui.showToast({
  message: "저장되었습니다.",
  duration: "short"
});`,
    parameters: [
      { name: "message", type: "string", required: true, description: "표시할 메시지" },
      { name: "duration", type: "'short' | 'long'", required: false, description: "토스트 표시 시간" },
    ],
  },
  {
    method: "UI",
    path: "Union.ui.showModal(options)",
    description: "네이티브 확인 모달을 표시하고 사용자 선택을 반환합니다.",
    permission: null,
    code: `const { confirmed } = await Union.ui.showModal({
  title: "삭제",
  content: "정말 삭제하시겠습니까?",
  confirmText: "삭제",
  cancelText: "취소"
});`,
    parameters: [
      { name: "title", type: "string", required: true, description: "모달 제목" },
      { name: "content", type: "string", required: true, description: "모달 본문" },
      { name: "confirmText", type: "string", required: false, description: "확인 버튼 텍스트" },
      { name: "cancelText", type: "string", required: false, description: "취소 버튼 텍스트" },
      { name: "반환값.confirmed", type: "boolean", required: true, description: "확인 버튼 선택 여부" },
    ],
  },
  {
    method: "UI",
    path: "Union.ui.setNavigationBar(options)",
    description: "미니앱 상단 네비게이션 바의 제목과 색상을 설정합니다.",
    permission: null,
    code: `Union.ui.setNavigationBar({
  title: "축제 웨이팅",
  backgroundColor: "#FFFFFF",
  textColor: "#111111"
});`,
    parameters: [
      { name: "title", type: "string", required: false, description: "네비게이션 바 제목" },
      { name: "backgroundColor", type: "string", required: false, description: "배경색 hex 값" },
      { name: "textColor", type: "string", required: false, description: "텍스트색 hex 값" },
    ],
  },
  {
    method: "DEVICE",
    path: "Union.device.getLocation()",
    description: "사용자의 현재 GPS 위치를 조회합니다.",
    permission: "device.location",
    code: `const location = await Union.device.getLocation();
// { latitude, longitude, accuracy }`,
    parameters: [
      { name: "반환값.latitude", type: "number", required: true, description: "위도" },
      { name: "반환값.longitude", type: "number", required: true, description: "경도" },
      { name: "반환값.accuracy", type: "number", required: true, description: "정확도, 단위 meter" },
    ],
  },
  {
    method: "DEVICE",
    path: "Union.device.scanQRCode()",
    description: "카메라를 열어 QR 코드를 스캔합니다.",
    permission: "device.camera",
    code: `const { result } = await Union.device.scanQRCode();`,
    parameters: [
      { name: "반환값.result", type: "string", required: true, description: "스캔된 QR 문자열" },
    ],
  },
  {
    method: "DEVICE",
    path: "Union.device.vibrate(type?)",
    description: "네이티브 햅틱 피드백을 발생시킵니다.",
    permission: null,
    code: `Union.device.vibrate("medium");`,
    parameters: [
      { name: "type", type: "'light' | 'medium' | 'heavy'", required: false, description: "진동 강도, 기본값 medium" },
    ],
  },
  {
    method: "STORAGE",
    path: "Union.storage.get/set/remove/clear",
    description: "미니앱별로 격리된 key-value 저장소를 사용합니다.",
    permission: "device.storage",
    code: `await Union.storage.set("settings", { theme: "dark" });
const settings = await Union.storage.get("settings");
await Union.storage.remove("settings");
await Union.storage.clear();`,
    parameters: [
      { name: "key", type: "string", required: true, description: "저장소 키" },
      { name: "value", type: "unknown", required: false, description: "저장할 JSON 직렬화 가능 값" },
    ],
  },
  {
    method: "NETWORK",
    path: "Union.request(options)",
    description: "mTLS 인증이 적용되는 네이티브 네트워크 요청을 수행합니다.",
    permission: null,
    code: `const result = await Union.request({
  url: "https://api.example.com/orders",
  method: "GET",
  headers: { "X-App-Version": "1.0.0" },
  timeout: 5000
});

console.log(result.statusCode, result.data);`,
    parameters: [
      { name: "url", type: "string", required: true, description: "요청 URL" },
      { name: "method", type: "'GET' | 'POST' | 'PUT' | 'DELETE'", required: true, description: "HTTP method" },
      { name: "headers", type: "Record<string, string>", required: false, description: "요청 헤더" },
      { name: "body", type: "unknown", required: false, description: "요청 body" },
      { name: "timeout", type: "number", required: false, description: "요청 제한 시간, ms" },
    ],
  },
  {
    method: "ANALYTICS",
    path: "Union.analytics.trackEvent(name, params?)",
    description: "사용자 행동 이벤트를 기록합니다.",
    permission: null,
    code: `Union.analytics.trackEvent("button_click", {
  screen: "home",
  buttonId: "join_waiting"
});

Union.analytics.trackPageView("home");`,
    parameters: [
      { name: "eventName", type: "string", required: true, description: "이벤트 이름" },
      { name: "params", type: "Record<string, string | number | boolean>", required: false, description: "이벤트 속성" },
      { name: "pageName", type: "string", required: true, description: "페이지 이름" },
    ],
  },
];

const permissions = [
  { name: "user.profile", desc: "사용자 닉네임, 프로필 이미지" },
  { name: "user.email", desc: "사용자 이메일" },
  { name: "user.university", desc: "사용자 소속 대학" },
  { name: "device.location", desc: "GPS 위치" },
  { name: "device.camera", desc: "카메라, QR 스캔" },
  { name: "device.storage", desc: "미니앱 격리 저장소" },
];

export default function BridgeApiPage() {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-56 shrink-0 lg:block animate-slide-in-left">
        <DocSidebar />
      </aside>
      <div className="flex-1 space-y-6 max-w-3xl">
        <div className="animate-fade-up">
          <h1 className="heading-display text-2xl tracking-tight">Bridge API 레퍼런스</h1>
          <p className="text-sm text-muted-foreground mt-1">
            @union-miniapp/sdk가 제공하는 네이티브 브릿지 API
          </p>
        </div>

        <div className="rounded-xl border border-border/60 p-4 bg-muted/30 animate-fade-up delay-1">
          <p className="text-sm text-muted-foreground">
            SDK를 사용하려면{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-[12px] font-mono">@union-miniapp/sdk</code>를
            import 하고, 필요한 권한을{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-[12px] font-mono">union.config.json</code>의
            permissions에 선언하세요.
          </p>
        </div>

        <Card className="animate-fade-up delay-2 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">권한 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {permissions.map((permission) => (
                <div key={permission.name} className="rounded-lg border border-border/40 px-3 py-2">
                  <code className="font-mono text-xs text-union">{permission.name}</code>
                  <p className="mt-1 text-xs text-muted-foreground">{permission.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {bridgeApis.map((api, i) => (
          <div key={api.path} className={`animate-fade-up delay-${Math.min(i + 3, 8)}`}>
            <ApiEndpoint method={api.method} path={api.path} description={api.description}>
              <div className="space-y-4">
                {api.permission && (
                  <p className="text-[11px] text-muted-foreground">
                    필요 권한:{" "}
                    <code className="bg-union/10 text-union px-1.5 py-0.5 rounded font-mono">{api.permission}</code>
                  </p>
                )}
                <CodeBlock code={api.code} />
                {api.parameters.length > 0 && (
                  <ApiParameterTable parameters={api.parameters} />
                )}
              </div>
            </ApiEndpoint>
          </div>
        ))}
      </div>
    </div>
  );
}
