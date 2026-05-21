import type { DocPage } from "../types";

export const submit: DocPage = {
  slug: "/docs/distribution/submit",
  title: "업로드와 심사",
  description:
    "validate를 통과한 .unionapp을 Publisher Dashboard에 업로드하고 심사를 신청하는 단계입니다.",
  category: "distribution",
  blocks: [
    {
      type: "callout",
      tone: "warning",
      title: "현재 union upload CLI는 미구현",
      body:
        "union upload 명령은 백엔드 API 연동이 진행 중입니다. 완성된 .unionapp 파일은 본 Publisher Dashboard 웹 UI에서 직접 업로드해 주세요.",
    },
    {
      type: "text",
      title: "업로드 흐름",
      body: [
        "1. union build && union validate로 .unionapp을 생성하고 검증합니다.",
        "2. Publisher Dashboard의 워크스페이스 > 미니앱 페이지에서 새 버전 업로드를 선택합니다.",
        "3. 업로드 후 manifest를 자동 검증합니다(체크섬 일치, 권한 변경 확인).",
        "4. 자동 검증 통과 시 심사 대기열에 등록됩니다.",
        "5. 심사관이 수동 항목(완성도, 메타데이터, 콘텐츠 적합성)을 확인합니다.",
        "6. 결과는 워크스페이스 알림과 contactEmail로 통지됩니다.",
      ],
    },
    {
      type: "checklist",
      title: "제출 전 최종 체크리스트",
      items: [
        {
          id: "validate-pass",
          label: "union validate가 Critical 0건으로 통과했다",
          detail: "Warning/Info 항목도 가능한 한 줄였는지 확인합니다.",
        },
        {
          id: "manifest-fields",
          label: "union.config.json의 description, icon, permissions를 점검했다",
          detail: "사용자에게 노출되는 카드 정보가 정확한지 확인합니다.",
        },
        {
          id: "permissions-min",
          label: "선언한 권한이 실제 사용하는 것만 남아있다",
          detail: "최소 권한 원칙. 사용하지 않는 권한은 사용자 거부율을 높입니다.",
        },
        {
          id: "permissions-reason",
          label: "각 권한의 사용 사유를 설명하는 UI가 있다",
          detail: "심사 보완 요청에서 가장 자주 지적되는 항목입니다.",
        },
        {
          id: "no-placeholder",
          label: "placeholder, lorem, TODO 텍스트가 없다",
          detail: "Cmd+Shift+F로 'lorem', 'TODO', 'placeholder' 검색을 한 번 더 돌려보세요.",
        },
        {
          id: "all-buttons-work",
          label: "모든 버튼과 링크가 동작한다",
          detail: "준비 중 기능은 disabled 또는 '준비 중' 라벨로 표시했는지 확인합니다.",
        },
        {
          id: "empty-states",
          label: "데이터가 없을 때의 빈 상태 UI를 모두 그렸다",
          detail: "빈 화면이 그대로 노출되면 에러로 인식됩니다.",
        },
        {
          id: "error-states",
          label: "네트워크/권한/만료 에러 fallback이 모두 있다",
          detail: "try/catch + 재시도 버튼 + 안내 문구.",
        },
        {
          id: "no-pii-in-events",
          label: "analytics 이벤트 파라미터에 PII가 없다",
          detail: "이름, 이메일, 학번 등이 들어가면 자동 마스킹되거나 폐기됩니다.",
        },
        {
          id: "device-test",
          label: "실제 디바이스 또는 시뮬레이터에서 한 번 흘려봤다",
          detail: "Mock 환경과 실 디바이스 동작이 다를 수 있는 영역(권한 다이얼로그, 클립보드, QR 스캔)을 확인합니다.",
        },
      ],
    },
    {
      type: "text",
      title: "심사 결과 처리",
      body: [
        "승인: 다음 영업일부터 슈퍼앱에 노출됩니다. 워크스페이스에서 배포 토글로 활성화하세요.",
        "수정 요청: 어떤 항목이 어떤 이유로 보완되어야 하는지 알림과 contactEmail로 전달됩니다. 수정 후 새 버전을 빌드해 다시 업로드합니다.",
        "반려: Critical 사유 발생 시 즉시 반려됩니다. 사유 코드와 위치(파일:라인)가 함께 제공됩니다.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "재제출 팁",
      body:
        "수정 요청을 받은 항목만 고치고 version을 올려 재제출하세요(예: 1.0.0 → 1.0.1). manifest의 version이 같으면 동일 버전으로 인식되어 업로드가 거부됩니다.",
    },
  ],
};
