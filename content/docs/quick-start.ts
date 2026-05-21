import type { DocPage } from "./types";

export const quickStart: DocPage = {
  slug: "/docs/quick-start",
  title: "빠른 시작",
  description:
    "Union 미니앱을 5분 안에 처음부터 끝까지 흘려봅니다. CLI 설치, 프로젝트 생성, 개발, 빌드, 검증, 업로드까지 한 번에.",
  category: "getting-started",
  blocks: [
    {
      type: "text",
      title: "사전 준비",
      body: [
        "Node.js 18 이상과 npm 9 이상이 필요합니다.",
        "Publisher Dashboard 계정이 있어야 하고, 워크스페이스에 owner, admin, 또는 developer 권한이 있어야 미니앱을 업로드할 수 있습니다.",
      ],
    },
    {
      type: "steps",
      title: "전체 흐름",
      items: [
        {
          title: "1. 새 미니앱 프로젝트 생성",
          body: "Union CLI가 React + Vite + TypeScript 템플릿과 union.config.json을 만들어 줍니다.",
          code: {
            language: "bash",
            content: `npx union create my-first-app
cd my-first-app
npm install`,
          },
        },
        {
          title: "2. Mock Bridge로 개발 서버 실행",
          body: "브라우저에서 네이티브 없이도 Union SDK를 호출할 수 있도록 Mock Adapter가 자동으로 켜집니다. localhost:5173에서 바로 확인할 수 있습니다.",
          code: { language: "bash", content: `npx union dev` },
        },
        {
          title: "3. SDK로 첫 호출 작성",
          body: "전역 객체 Union을 통해 native 기능을 호출합니다. 권한이 필요한 메서드는 union.config.json에 미리 선언해야 합니다.",
          code: {
            language: "typescript",
            content: `import Union from "@union-miniapp/sdk";

async function greet() {
  const profile = await Union.auth.getUserProfile();
  await Union.ui.showToast({
    message: \`\${profile.name}님 환영합니다\`,
  });
}`,
          },
        },
        {
          title: "4. 프로덕션 빌드",
          body: "Vite 번들 → manifest.json 생성 → .unionapp 패키지를 만듭니다. 번들 사이즈는 기본 2MB 이하로 유지해야 합니다.",
          code: { language: "bash", content: `npx union build` },
        },
        {
          title: "5. 자동 검증",
          body: "필수 파일, 매니페스트 필드, 번들 사이즈, 보안 규칙 11개를 한 번에 점검합니다. Critical 항목은 즉시 반려 사유가 됩니다.",
          code: { language: "bash", content: `npx union validate` },
        },
        {
          title: "6. Dashboard에서 업로드",
          body: "현재 union upload CLI 명령은 백엔드 API 연동이 진행 중입니다. 완성된 .unionapp 파일은 Publisher Dashboard 웹 UI에서 업로드해 심사를 신청해 주세요.",
        },
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "다음으로 읽으면 좋은 문서",
      body:
        "프로젝트 설정 문서에서 union.config.json의 모든 필드를, Bridge API 문서에서 7개 모듈의 전체 메서드를, 가이드라인 > 심사 기준에서 반려를 피하는 방법을 확인할 수 있습니다.",
    },
  ],
};
