import type { DocPage } from "../types";

export const build: DocPage = {
  slug: "/docs/distribution/build",
  title: "빌드와 검증",
  description:
    "union build로 .unionapp 패키지를 만들고, union validate로 자동 검사를 통과시키는 단계입니다.",
  category: "distribution",
  blocks: [
    {
      type: "text",
      title: "빌드 흐름",
      body: [
        "union build는 다음 순서로 동작합니다.",
        "1. Vite로 src를 번들링합니다 (TypeScript 타입체크 포함).",
        "2. icon, previews 등 정적 자산을 dist로 복사합니다.",
        "3. manifest.json을 생성합니다 (appId, version, permissions, bundleSize, checksum 포함).",
        "4. dist를 zip으로 묶어 .unionapp 파일을 만듭니다.",
      ],
    },
    {
      type: "code",
      title: "빌드 명령",
      language: "bash",
      code: `npx union build

# 결과
# - dist/index.html
# - dist/assets/*
# - dist/manifest.json
# - my-app-1.0.0.unionapp`,
    },
    {
      type: "text",
      title: "validate가 검사하는 것",
      body: [
        "union validate는 빌드 산출물(dist 또는 .unionapp)을 입력으로 받아 4단계 검사를 실행합니다.",
        "1. 필수 파일 존재: index.html, manifest.json.",
        "2. 매니페스트 필드: appId(reverse domain), name, version(semver). 이 셋만 필수입니다.",
        "3. 번들 사이즈: build.maxBundleSize(기본 2MB) 초과 시 실패.",
        "4. 보안 스캔: 11개 규칙 매칭 (Critical/Warning/Info 분류).",
      ],
    },
    {
      type: "code",
      title: "검증 명령",
      language: "bash",
      code: `npx union validate

# 통과 예시:
# ✓ 필수 파일 모두 존재
# ✓ manifest.json 필수 필드 OK
# ✓ 번들 사이즈 1.34MB / 2MB
# ✓ 보안 스캔: critical 0, warning 0, info 2

# 실패 예시:
# ✗ critical: src/handler.ts:42 eval() 사용 금지
# → 즉시 반려 사유. 코드 수정 후 재빌드.`,
    },
    {
      type: "callout",
      tone: "warning",
      title: "Critical은 즉시 차단",
      body:
        "Critical 항목이 하나라도 있으면 validate는 실패하고 .unionapp 업로드가 거부됩니다. Warning과 Info는 통과시키지만 심사 단계에서 다시 점검됩니다.",
    },
    {
      type: "text",
      title: "manifest.json에 자동으로 들어가는 것",
      body: [
        "appId, name, version, permissions: union.config.json에서 그대로.",
        "sdkVersion, minSdkVersion: SDK 버전 정보.",
        "entry: 빌드된 진입 파일 경로 (보통 index.html).",
        "bundleSize, packageSize: 바이트 단위 크기.",
        "checksum: dist 콘텐츠의 sha256 해시. 업로드 시 무결성 검증에 사용됩니다.",
        "buildTime: ISO8601 타임스탬프.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "PACKAGE_SPEC.md의 signature 검증",
      body:
        "PACKAGE_SPEC.md는 .unionapp의 HMAC-SHA256 signature 검증을 명시하지만, 현재 union validate는 signature 검증을 수행하지 않습니다. 향후 검증 단계가 추가될 예정이며, 추가되면 본 문서를 갱신합니다.",
    },
  ],
};
