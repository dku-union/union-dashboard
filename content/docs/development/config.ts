import type { DocPage } from "../types";

export const config: DocPage = {
  slug: "/docs/development/config",
  title: "프로젝트 설정",
  description:
    "union.config.json은 미니앱의 메타데이터를 정의합니다. CLI는 빌드와 검증 단계에서 이 파일을 기준으로 manifest를 생성합니다.",
  category: "development",
  blocks: [
    {
      type: "text",
      title: "기본 구조",
      body: [
        "프로젝트 루트의 union.config.json은 미니앱의 식별자, 권한, 빌드 설정을 모두 담습니다.",
        "필수 필드는 누락 시 union validate에서 즉시 실패합니다. 권장 필드는 누락해도 빌드가 통과하지만 심사에서 보완 요청을 받을 수 있습니다.",
      ],
    },
    {
      type: "code",
      title: "예시",
      language: "json",
      code: `{
  "appId": "com.publisher.festival-waiting",
  "name": "축제 대기열",
  "version": "1.0.0",
  "description": "축제 부스 대기 인원을 실시간으로 확인합니다.",
  "icon": "./assets/icon.png",
  "category": "campus",
  "permissions": ["user.profile", "user.university"],
  "contactEmail": "publisher@example.com",
  "keywords": ["축제", "대기", "캠퍼스"],
  "previews": ["./assets/preview-1.png"],
  "minSdkVersion": "1.0.0",
  "build": {
    "entry": "src/main.tsx",
    "outDir": "dist",
    "maxBundleSize": "2MB"
  }
}`,
    },
    {
      type: "text",
      title: "필수 필드",
      body: [
        "appId — reverse domain 형식만 허용합니다. /^[a-z][a-z0-9]*(\\.[a-z][a-z0-9-]*)+$/ 정규식과 일치해야 합니다. 예: com.publisher.app-name.",
        "name — 슈퍼앱 안에서 사용자에게 노출되는 이름입니다.",
        "version — semver 형식 (X.Y.Z) 만 허용합니다.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "필수 필드는 이 세 개뿐",
      body:
        "현재 union validate는 appId, name, version 세 필드만 필수로 검사합니다. 다른 필드는 빌드 자체는 통과하지만, 심사 단계에서 누락 시 보완 요청을 받습니다. 사용자에게 보여줄 모든 정보를 채워두세요.",
    },
    {
      type: "text",
      title: "권장 필드 (심사 보완 요청 대상)",
      body: [
        "description — 미니앱이 무엇을 하는지 한두 문장으로. 카드 UI에 노출됩니다.",
        "icon — 1024x1024 이상 PNG 권장. 빌드 시 manifest에 함께 포함됩니다.",
        "category — 슈퍼앱 카테고리 분류용. campus, utility, social 등.",
        "permissions — 사용하려는 PermissionScope 배열. 선언하지 않은 권한 사용 시 런타임에 거부됩니다.",
        "contactEmail — 사용자/심사자가 연락할 채널.",
      ],
    },
    {
      type: "text",
      title: "선택 필드",
      body: [
        "keywords — 검색 노출용 키워드 배열.",
        "previews — 미니앱 카드/상세 페이지에 표시할 스크린샷 경로 배열.",
        "minSdkVersion — 이 미니앱이 동작하는 최소 SDK 버전.",
        "build.maxBundleSize — 기본 2MB. \"500KB\", \"1.5MB\" 같은 사람이 읽는 형식.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "권한은 필수보다 적게 선언하세요",
      body:
        "선언한 권한은 모두 사용자에게 노출됩니다. 사용하지 않는 권한을 선언하면 사용자가 거부할 가능성이 커지고 심사 보완 요청 사유가 됩니다. 권한 모델 문서에서 권한별 사용 사례를 확인하세요.",
    },
  ],
};
