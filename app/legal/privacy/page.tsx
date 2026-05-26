import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 · Union",
  description: "Union 퍼블리셔 콘솔의 개인정보처리방침입니다.",
};

type Row = { label: string; value: string };

const COLLECT_ITEMS: Row[] = [
  {
    label: "필수 항목",
    value:
      "이름, 이메일, 비밀번호(단방향 해시), 이메일 인증 코드",
  },
  {
    label: "워크스페이스 정보",
    value:
      "워크스페이스 이름·설명·연락처 이메일, 멤버 역할, 초대 이메일",
  },
  {
    label: "미니앱 운영 데이터",
    value:
      "미니앱 이름·설명·아이콘·카테고리·태그·권한 명세, 빌드 파일(.unionapp), 릴리즈 노트, 심사 결과·사유",
  },
  {
    label: "사용 로그",
    value:
      "Union 슈퍼앱 안에서 발생한 미니앱 사용 이벤트(미니앱 ID, 사용 시각, 익명 사용자 ID)",
  },
  {
    label: "자동 수집 정보",
    value:
      "접속 IP, 브라우저·OS 정보, 세션 쿠키(union-session, httpOnly, 7일), 운영 로그",
  },
];

const PURPOSE: string[] = [
  "회원 식별·인증 및 세션 유지",
  "워크스페이스 멤버 초대·역할 관리",
  "미니앱 등록·심사·배포·버전 관리",
  "심사 결과, 멤버 초대 등 운영 알림(이메일·인앱) 발송",
  "장애 대응·악성 이용 방지를 위한 운영 로그 분석",
  "캡스톤 연구·발표 목적의 비식별화된 통계 작성",
];

const RETENTION: Row[] = [
  {
    label: "회원 정보",
    value: "탈퇴 또는 운영팀 통합 삭제 시까지. 탈퇴 후 14일 이내 즉시 파기",
  },
  {
    label: "이메일 인증 코드",
    value: "발급 후 10분, 검증 완료 시 즉시 만료 처리",
  },
  {
    label: "미니앱·빌드 메타데이터",
    value: "퍼블리셔의 삭제 요청 또는 캡스톤 종료 시까지",
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
    value:
      "회원·워크스페이스·미니앱 메타데이터 저장. 데이터 리전: 운영팀이 지정한 지역에 위치",
  },
  {
    label: "Google Cloud Storage",
    value: "미니앱 빌드 파일(.unionapp) 및 앱 아이콘 보관",
  },
  {
    label: "Vercel",
    value: "퍼블리셔 콘솔(웹) 호스팅 및 정적 자산 전송",
  },
  {
    label: "Gmail SMTP",
    value: "이메일 인증 코드, 멤버 초대 메일 발송",
  },
  {
    label: "Firebase Cloud Messaging (Union 슈퍼앱)",
    value:
      "Union 슈퍼앱 사용자에게 푸시 알림 전송(콘솔 퍼블리셔에게는 적용되지 않음)",
  },
];

const RIGHTS: string[] = [
  "본인 정보 열람·정정·삭제 요청권",
  "처리 정지 및 회원 탈퇴 요청권",
  "수신한 운영 알림(이메일·인앱) 의 수신 거부 요청권",
  "권리 행사는 워크스페이스 설정 화면 또는 union@dankook.ac.kr 로 요청할 수 있습니다.",
];

const SECURITY: string[] = [
  "비밀번호는 단방향 해시(BCrypt) 로만 저장하며, 평문은 어떤 경로로도 보관되지 않습니다.",
  "인증 토큰은 httpOnly·Secure 속성의 쿠키로 발급되며, 클라이언트 자바스크립트에서 접근할 수 없습니다.",
  "퍼블리셔 콘솔과 슈퍼앱 백엔드 간의 모든 요청은 HTTPS 로 전송됩니다.",
  "데이터 접근은 역할(워크스페이스 owner/admin/developer/viewer, 시스템 관리자) 기반 권한 검증을 통과해야만 가능합니다.",
  "관리자 액션(상태 변경 등) 은 추적 가능한 형태로 운영 로그에 기록됩니다.",
];

export default function PrivacyPage() {
  return (
    <article>
      <header className="mb-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-3">
          Legal
        </p>
        <h1 className="heading-display text-[32px] font-bold leading-[1.15] tracking-tight sm:text-[40px]">
          개인정보처리방침
        </h1>
        <p className="mt-4 text-[13px] text-[#8E908E]">
          시행일: 2026년 5월 26일
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
            본 방침은 단국대학교 캡스톤디자인 2026 Union 팀이 운영하는 퍼블리셔 콘솔(이하 “Union”) 이 수집·처리하는 개인정보의 항목,
            이용 목적, 보관 기간, 외부 위탁 현황, 이용자의 권리, 안전 조치를 안내하는 것을 목적으로 합니다.
          </p>
          <p className="mt-3">
            Union 은 학내 졸업 프로젝트로 운영되는 데모/연구 성격의 플랫폼이며, 정식 상용 서비스로 전환될 경우 본 방침은 별도 공지 후 갱신됩니다.
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
            만 14세 미만의 회원가입은 받지 않으며, 가입 양식에서 학내 이메일(@dankook.ac.kr 등) 또는 학내 구성원 확인이 가능한 이메일 사용을 권장합니다.
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
            사용 이벤트 로그는 사용자 식별이 불가능한 형태(익명 ID, 사용 시각) 로만 저장되며, 캡스톤 발표·연구 과정에서는 집계·비식별 통계로만 활용됩니다.
          </p>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            4. 보관 기간
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
            5. 처리 위탁 및 외부 제공
          </h2>
          <p className="mb-4">
            Union 은 다음 외부 서비스에 한해 개인정보 처리를 위탁하며, 이외에 외부에 개인정보를 별도로 제공하지 않습니다.
            아래 처리자는 각자의 약관·정책에 따라 데이터를 처리합니다.
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
            6. 이용자의 권리
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            {RIGHTS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            7. 안전성 확보 조치
          </h2>
          <ul className="list-disc space-y-1.5 pl-5">
            {SECURITY.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            8. 쿠키(Cookies) 사용
          </h2>
          <p>
            Union 은 로그인 세션 유지를 위해 httpOnly 속성의 쿠키(<code className="rounded bg-[#F3F6FC] px-1.5 py-0.5 text-[12px]">union-session</code>) 를 사용합니다.
            해당 쿠키는 자바스크립트에서 접근할 수 없으며, 7일이 경과하거나 로그아웃 시 만료됩니다.
            이용자는 브라우저 설정에서 쿠키 저장을 차단할 수 있으나, 차단 시 로그인 기능이 제한됩니다.
          </p>
        </section>

        <section>
          <h2 className="heading-display text-[18px] font-semibold text-[#262725] mb-3">
            9. 방침의 변경
          </h2>
          <p>
            본 방침이 변경되는 경우 본 페이지에 시행일과 함께 게시하며, 중요한 변경 사항은 인앱·이메일 알림으로 사전 안내합니다.
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
