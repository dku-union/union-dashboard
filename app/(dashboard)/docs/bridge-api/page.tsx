"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { CodeBlock } from "@/components/docs/code-block";
import { ApiEndpoint } from "@/components/docs/api-endpoint";
import { ApiParameterTable } from "@/components/docs/api-parameter-table";

const bridgeApis = [
  {
    method: "GET", path: "UnionBridge.getUserProfile()",
    description: "현재 로그인한 사용자의 프로필 정보를 조회합니다.", permission: "user.profile",
    code: `const profile = await UnionBridge.getUserProfile();\n// { id, name, email, profileImageUrl }`,
    parameters: [
      { name: "반환값.id", type: "string", required: true, description: "사용자 고유 ID" },
      { name: "반환값.name", type: "string", required: true, description: "사용자 이름" },
      { name: "반환값.email", type: "string", required: true, description: "이메일 주소" },
      { name: "반환값.profileImageUrl", type: "string", required: false, description: "프로필 이미지 URL" },
    ],
  },
  {
    method: "GET", path: "UnionBridge.getStudentInfo()",
    description: "사용자의 학생 정보를 조회합니다.", permission: "user.student_info",
    code: `const info = await UnionBridge.getStudentInfo();\n// { studentId, department, grade, semester }`,
    parameters: [
      { name: "반환값.studentId", type: "string", required: true, description: "학번" },
      { name: "반환값.department", type: "string", required: true, description: "학과" },
      { name: "반환값.grade", type: "number", required: true, description: "학년" },
      { name: "반환값.semester", type: "number", required: true, description: "학기" },
    ],
  },
  {
    method: "POST", path: "UnionBridge.requestPayment(options)",
    description: "인앱 결제를 요청합니다.", permission: "payment",
    code: `const result = await UnionBridge.requestPayment({\n  amount: 15000,\n  currency: "KRW",\n  itemName: "프리미엄 플랜 (1개월)",\n  orderId: "order-12345"\n});\n// { success, transactionId, paidAt }`,
    parameters: [
      { name: "amount", type: "number", required: true, description: "결제 금액" },
      { name: "currency", type: "string", required: true, description: "통화 코드 (KRW)" },
      { name: "itemName", type: "string", required: true, description: "결제 상품명" },
      { name: "orderId", type: "string", required: true, description: "주문 고유 ID" },
    ],
  },
  {
    method: "GET", path: "UnionBridge.getLocation()",
    description: "사용자의 현재 위치 정보를 조회합니다.", permission: "location",
    code: `const location = await UnionBridge.getLocation();\n// { latitude, longitude, accuracy }`,
    parameters: [
      { name: "반환값.latitude", type: "number", required: true, description: "위도" },
      { name: "반환값.longitude", type: "number", required: true, description: "경도" },
      { name: "반환값.accuracy", type: "number", required: true, description: "정확도 (미터)" },
    ],
  },
  {
    method: "POST", path: "UnionBridge.sendNotification(options)",
    description: "사용자에게 푸시 알림을 발송합니다.", permission: "notification",
    code: `await UnionBridge.sendNotification({\n  title: "새 스터디 매칭!",\n  body: "관심 분야의 새로운 스터디가 생성되었습니다.",\n  data: { studyId: "study-789" }\n});`,
    parameters: [
      { name: "title", type: "string", required: true, description: "알림 제목" },
      { name: "body", type: "string", required: true, description: "알림 내용" },
      { name: "data", type: "object", required: false, description: "알림 커스텀 데이터" },
    ],
  },
  {
    method: "POST", path: "UnionBridge.openCamera(options?)",
    description: "기기의 카메라를 열어 사진을 촬영합니다.", permission: "camera",
    code: `const photo = await UnionBridge.openCamera({\n  quality: 0.8,\n  maxWidth: 1024\n});\n// { imageUri, width, height }`,
    parameters: [
      { name: "quality", type: "number", required: false, description: "이미지 품질 (0-1)" },
      { name: "maxWidth", type: "number", required: false, description: "최대 너비 (px)" },
    ],
  },
  {
    method: "POST", path: "UnionBridge.shareContent(options)",
    description: "콘텐츠를 외부 앱으로 공유합니다.", permission: "share",
    code: `await UnionBridge.shareContent({\n  title: "캠퍼스 맛집 추천",\n  text: "이 맛집 정말 맛있어요!",\n  url: "https://union.app/food/123"\n});`,
    parameters: [
      { name: "title", type: "string", required: true, description: "공유 제목" },
      { name: "text", type: "string", required: false, description: "공유 텍스트" },
      { name: "url", type: "string", required: false, description: "공유 URL" },
    ],
  },
  {
    method: "POST", path: "UnionBridge.closeApp()",
    description: "현재 미니앱을 종료합니다.", permission: null,
    code: `await UnionBridge.closeApp();`,
    parameters: [],
  },
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
            Union 플랫폼과 미니앱 간 통신을 위한 API 레퍼런스
          </p>
          <div className="h-0.5 w-8 bg-union mt-3" />
        </div>

        <div className="rounded-xl border border-border/60 p-4 bg-muted/30 animate-fade-up delay-1">
          <p className="text-sm text-muted-foreground">
            Bridge API를 사용하려면{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-[12px] font-mono">@union/bridge</code>{" "}
            패키지를 import 하고, 필요한 권한을{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-[12px] font-mono">union.config.json</code>에
            선언해야 합니다.
          </p>
        </div>

        {bridgeApis.map((api, i) => (
          <div key={i} className={`animate-fade-up delay-${Math.min(i + 2, 8)}`}>
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
