import type { DocPage } from "../types";

export const permissions: DocPage = {
  slug: "/docs/development/permissions",
  title: "권한 모델",
  description:
    "Union 미니앱은 manifest에 미리 선언한 권한만 사용할 수 있습니다. 사용자는 첫 호출 시점에 권한 동의 여부를 결정합니다.",
  category: "development",
  blocks: [
    {
      type: "text",
      title: "동작 방식",
      body: [
        "1. union.config.json의 permissions 배열에 사용할 PermissionScope를 선언합니다.",
        "2. 빌드 단계에서 이 선언은 manifest.json으로 들어갑니다.",
        "3. 미니앱 실행 중 해당 권한을 처음 요구하는 API를 호출하면 슈퍼앱이 사용자에게 동의를 받습니다.",
        "4. 사용자가 거부하면 PERMISSION_DENIED 에러가 throw됩니다.",
        "5. manifest에 선언하지 않은 권한은 사용자 동의 여부와 무관하게 즉시 거부됩니다.",
      ],
    },
    {
      type: "permissions",
      title: "PermissionScope 6종",
      items: [
        {
          scope: "user.profile",
          grants: "사용자 nickname과 profileImage 접근",
          recommended: "환영 메시지, 사용자별 맞춤 콘텐츠 표시",
          abuse: "별도 회원가입 없이 외부 서비스로 프로필 데이터 전송",
        },
        {
          scope: "user.email",
          grants: "사용자 이메일 주소 접근",
          recommended: "공식 알림, 영수증 발송이 본질인 미니앱",
          abuse: "마케팅 메일링 리스트 수집, 무관한 외부 가입",
        },
        {
          scope: "user.university",
          grants: "사용자 소속 대학 정보",
          recommended: "교내 한정 콘텐츠 게이팅, 학교별 통계 표시",
          abuse: "대학 정보를 사용자 식별/타겟팅에 활용",
        },
        {
          scope: "device.location",
          grants: "기기 위치 (위도/경도/정확도)",
          recommended: "캠퍼스 내 위치 기반 안내, 부스 길찾기",
          abuse: "백그라운드 위치 추적, 위치 이력 외부 전송",
        },
        {
          scope: "device.camera",
          grants: "카메라 접근 (QR 스캔)",
          recommended: "출석 체크 QR, 입장권 검증, 명함 인식",
          abuse: "사용자 의도 없이 사진/영상 캡처",
        },
        {
          scope: "device.storage",
          grants: "기기 파일 시스템 (이미지/파일 저장 및 읽기)",
          recommended: "사용자 첨부 파일 업로드, 보고서 PDF 저장",
          abuse: "전체 사진 라이브러리 스캔, 외부 전송",
        },
      ],
    },
    {
      type: "text",
      title: "최소 권한 원칙",
      body: [
        "사용하지 않는 권한을 선언하지 마세요. 선언된 권한은 사용자에게 모두 노출됩니다.",
        "권한 사용 사유를 manifest의 description과 미니앱 첫 화면에서 명시적으로 설명하세요. 이 설명이 모호하면 심사에서 보완 요청을 받습니다.",
        "권한 거부 시 미니앱이 동작을 중단하지 않도록 fallback UX를 제공하세요. 예: 위치 권한 거부 시 수동 검색 입력란.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "권한 거부 처리",
      body:
        "권한이 필요한 API는 거부 시 UnionError(code='PERMISSION_DENIED')를 throw합니다. try/catch로 감싸 사용자에게 명확한 안내와 대체 경로를 제시하세요.",
    },
  ],
};
