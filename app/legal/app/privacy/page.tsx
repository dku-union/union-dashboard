import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 (앱) · Union",
  description: "Union 슈퍼앱 사용자의 개인정보처리방침입니다.",
};

type Row = { label: string; value: string };

const COLLECT_ITEMS: Row[] = [
  {
    label: "필수 항목",
    value: "이메일, 닉네임, 소속 대학, 이메일 인증 여부",
  },
  {
    label: "프로필(선택)",
    value: "프로필 이미지(직접 업로드 시에만 수집·저장)",
  },
  {
    label: "기기·푸시",
    value:
      "푸시 알림 등록 토큰(FCM), 기기 식별자, 미니앱별 알림 구독 설정",
  },
  {
    label: "사용 기록",
    value:
      "미니앱 실행 이벤트(미니앱 ID·실행 시각), 검색어, 최근 사용한 미니앱 목록",
  },
  {
    label: "신고 내역",
    value: "신고 대상(미니앱 등), 신고 사유, 상세 내용",
  },
  {
    label: "자동 수집 정보",
    value: "접속 IP, OS·기기 정보, 인증 토큰(access·refresh), 운영 로그",
  },
];

const PURPOSE: string[] = [
  "회원 식별·인증 및 로그인 세션 유지",
  "소속 대학 기반 미니앱 추천·탐색 제공",
  "푸시 알림 발송 및 미니앱 알림 구독 관리",
  "미니앱 사용 기록을 통한 최근 사용·인기 미니앱 표시",
  "신고 접수·처리 등 안전한 이용 환경 운영",
  "장애 대응·악성 이용 방지를 위한 운영 로그 분석",
  "캡스톤 연구·발표 목적의 비식별화된 통계 작성",
];

const RETENTION: Row[] = [
  {
    label: "회원 정보",
    value:
      "회원 탈퇴 시까지. 탈퇴 시 계정 상태를 즉시 탈퇴 처리하고 14일 이내 파기",
  },
  {
    label: "인증 토큰·푸시 토큰",
    value:
      "탈퇴·로그아웃 즉시 무효화·삭제. 탈퇴 시 모든 기기의 토큰을 무효화하고 푸시 등록 토큰을 삭제",
  },
  {
    label: "이메일(식별자)",
    value:
      "탈퇴 시 동일 이메일 재가입이 가능하도록 비식별 처리(원문 미보관)",
  },
  {
    label: "사용 이벤트 로그",
    value: "최대 12개월(통계 분석 후 비식별·집계 데이터만 보관)",
  },
  {
    label: "운영·접근 로그",
    value: "최대 3개월(장애 대응·보안 사고 대비 목적)",
  },
];

const PROCESSORS: Row[] = [
  {
    label: "Neon (PostgreSQL)",
    value: "회원·구독·사용 기록 등 서비스 데이터 저장",
  },
  {
    label: "Google Cloud (Cloud Run · Storage)",
    value: "백엔드 API 운영 및 프로필 이미지 보관",
  },
  {
    label: "Firebase Cloud Messaging",
    value: "기기로의 푸시 알림 전송",
  },
  {
    label: "Vercel",
    value: "약관·개인정보처리방침 등 웹 페이지 호스팅",
  },
];

const RIGHTS: string[] = [
  "프로필(닉네임·이미지) 열람 및 수정 — 앱 내 ‘프로필 수정’",
  "회원 탈퇴를 통한 삭제 요청 — 앱 내 ‘회원 탈퇴’",
  "푸시 알림 수신 거부 및 미니앱 구독 해지 — 앱 내 ‘알림 설정’",
  "기타 권리 행사·문의는 union@dankook.ac.kr 로 요청할 수 있습니다.",
];

const SECURITY: string[] = [
  "앱과 백엔드 간의 모든 통신은 HTTPS 로 암호화됩니다.",
  "로그인은 access·refresh 토큰 기반으로 처리되며, 토큰은 기기의 보안 저장소(Keychain)에 저장됩니다.",
  "로그아웃·탈퇴 시 해당 세션의 토큰을 서버에서 무효화하고, 기기의 인증 정보·캐시를 제거합니다.",
  "탈퇴 시 잔여 토큰으로 인증이 재발급되지 않도록 서버에서 토큰 재발급을 차단합니다.",
];

export default function AppPrivacyPage() {
  return (
    <article>
      <header className="mb-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-3">
          Legal · 앱 사용자
        </p>
        <h1 className="heading-display text-[32px] font-bold leading-[1.15] tracking-tight sm:text-[40px]">
          개인정보처리방침
        </h1>
        <p className="mt-4 text-[13px] text-[#8E908E]">
          시행일: 2026년 6월 5일
        </p>
        <p className="mt-1 text-[13px] text-[#8E908E]">
          운영: 단국대학교 캡스톤디자인 2026 Union 팀 · 문의 union@dankook.ac.kr
        </p>
      </header>

      <div className="space-y-12 text-[14px] leading-[1.85] text-[#4A4C4A]">
        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            1. 처리 방침의 목적
          </h2>
          <p>
            본 방침은 단국대학교 캡스톤디자인 2026 Union 팀이 운영하는 대학생 대상
            슈퍼앱 “Union” (이하 “앱”) 이 앱 사용자로부터 수집·처리하는 개인정보의
            항목, 이용 목적, 보관 기간, 외부 위탁 현황, 이용자의 권리, 안전 조치를
            안내하는 것을 목적으로 합니다.
          </p>
          <p className="mt-3">
            Union 은 학내 졸업 프로젝트로 운영되는 데모/연구 성격의 플랫폼이며, 정식
            상용 서비스로 전환될 경우 본 방침은 별도 공지 후 갱신됩니다. 미니앱을
            등록·운영하는 퍼블리셔에 대한 처리는 별도의{" "}
            <a
              href="/legal/privacy"
              className="text-[#E83A33] underline underline-offset-2"
            >
              퍼블리셔 콘솔 개인정보처리방침
            </a>{" "}
            을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            2. 수집하는 개인정보의 항목
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#DCE4F2] bg-white">
            {COLLECT_ITEMS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[150px_1fr] gap-4 px-5 py-3.5 sm:grid-cols-[170px_1fr] ${
                  i > 0 ? "border-t border-[#DCE4F2]" : ""
                }`}
              >
                <p className="text-[12px] font-semibold text-[#262725]">{row.label}</p>
                <p className="text-[13px] text-[#4A4C4A]">{row.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[#8E908E]">
            가입 시 학내 구성원 확인이 가능한 대학 이메일 사용을 권장하며, 이메일
            인증을 통해 본인 확인을 진행합니다.
          </p>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            3. 개인정보의 이용 목적
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            {PURPOSE.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="mt-3 text-[13px]">
            사용 이벤트 로그는 캡스톤 발표·연구 과정에서 집계·비식별 통계로만
            활용됩니다.
          </p>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            4. 보관 기간 및 탈퇴 시 처리
          </h2>
          <div className="overflow-hidden rounded-lg border border-[#DCE4F2] bg-white">
            {RETENTION.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[150px_1fr] gap-4 px-5 py-3.5 sm:grid-cols-[170px_1fr] ${
                  i > 0 ? "border-t border-[#DCE4F2]" : ""
                }`}
              >
                <p className="text-[12px] font-semibold text-[#262725]">{row.label}</p>
                <p className="text-[13px] text-[#4A4C4A]">{row.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            5. 미니앱과 권한
          </h2>
          <p>
            Union 앱 안에서 동작하는 미니앱은 제3자(퍼블리셔) 가 제공하며, 기능
            수행을 위해 카메라·위치·사진·저장소 등 기기 권한을 요청할 수 있습니다.
          </p>
          <p className="mt-3">
            각 권한은 사용자가 허용한 경우에만 사용되며, 앱 내 ‘권한 관리’ 또는 기기
            설정에서 언제든 변경할 수 있습니다. 미니앱이 권한을 통해 수집·처리하는
            정보에 대한 책임은 해당 미니앱을 운영하는 퍼블리셔에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            6. 처리 위탁 및 외부 제공
          </h2>
          <p className="mb-4">
            Union 은 다음 외부 서비스에 한해 개인정보 처리를 위탁하며, 이외에 외부에
            개인정보를 별도로 제공하지 않습니다. 아래 처리자는 각자의 약관·정책에 따라
            데이터를 처리합니다.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#DCE4F2] bg-white">
            {PROCESSORS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[170px_1fr] gap-4 px-5 py-3.5 sm:grid-cols-[210px_1fr] ${
                  i > 0 ? "border-t border-[#DCE4F2]" : ""
                }`}
              >
                <p className="text-[12px] font-semibold text-[#262725]">{row.label}</p>
                <p className="text-[13px] text-[#4A4C4A]">{row.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            7. 이용자의 권리
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            {RIGHTS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            8. 안전성 확보 조치
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            {SECURITY.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            9. 방침의 변경
          </h2>
          <p>
            본 방침이 변경되는 경우 본 페이지에 시행일과 함께 게시하며, 중요한 변경
            사항은 인앱·푸시 알림으로 사전 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            10. 개인정보 보호 책임자
          </h2>
          <p>
            본 서비스의 개인정보 보호 관련 문의·요청은 아래로 연락해 주시기 바랍니다.
          </p>
          <p className="mt-3">
            단국대학교 캡스톤디자인 2026 Union 팀
            <br />
            이메일: union@dankook.ac.kr
          </p>
        </section>
      </div>
    </article>
  );
}
