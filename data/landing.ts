import {
  AppWindow,
  BadgeCheck,
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Guitar,
  HeartHandshake,
  House,
  MapPinned,
  Megaphone,
  Search,
  ShoppingBag,
  Star,
  Trophy,
  Users,
} from "lucide-react";

export const landingNavItems = [
  { label: "서비스 소개", href: "#service" },
  { label: "출시 흐름", href: "#how-it-works" },
  { label: "미니앱", href: "#miniapps" },
  { label: "활용 사례", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];

export const landingStats = [
  { label: "출시 흐름", value: "4단계" },
  { label: "관리 단위", value: "워크스페이스" },
  { label: "배포 대상", value: "슈퍼앱" },
];

export const serviceHighlights = [
  {
    title: "슈퍼앱 안의 미니앱 배포",
    description: "별도 앱 설치 없이 Union 슈퍼앱 안에서 대학생에게 필요한 기능을 미니앱으로 제공합니다.",
    icon: Users,
  },
  {
    title: "검증 가능한 출시 흐름",
    description: "빌드 업로드, QR 테스트, 심사 요청, 승인 후 배포까지 콘솔에서 단계별로 관리합니다.",
    icon: BadgeCheck,
  },
  {
    title: "팀 단위 운영과 버전 관리",
    description: "워크스페이스에서 멤버 권한을 나누고, 앱별 버전 이력과 심사 상태를 이어서 관리합니다.",
    icon: AppWindow,
  },
];

export const miniAppCategories = [
  { title: "학생회 투표", subtitle: "학생회", icon: ClipboardList, accent: "text-cyan-600" },
  { title: "동아리 모집", subtitle: "동아리", icon: Guitar, accent: "text-rose-500" },
  { title: "캠퍼스 맛집", subtitle: "식당", icon: House, accent: "text-orange-500" },
  { title: "스터디 매칭", subtitle: "학습", icon: GraduationCap, accent: "text-indigo-500" },
  { title: "중고 거래", subtitle: "거래", icon: ShoppingBag, accent: "text-violet-500" },
  { title: "시간표 공유", subtitle: "학습", icon: CalendarDays, accent: "text-red-500" },
  { title: "기숙사 공지", subtitle: "생활", icon: Bell, accent: "text-amber-600" },
  { title: "취업 정보", subtitle: "취업", icon: Briefcase, accent: "text-emerald-600" },
  { title: "교내 뉴스", subtitle: "정보", icon: Megaphone, accent: "text-fuchsia-500" },
  { title: "운동 모임", subtitle: "동아리", icon: Trophy, accent: "text-pink-500" },
  { title: "독서 클럽", subtitle: "동아리", icon: AppWindow, accent: "text-sky-500" },
  { title: "봉사 활동", subtitle: "활동", icon: HeartHandshake, accent: "text-green-500" },
  { title: "강의 평가", subtitle: "학업", icon: Star, accent: "text-yellow-500" },
  { title: "분실물 찾기", subtitle: "생활", icon: Search, accent: "text-purple-500" },
  { title: "캠퍼스 맵", subtitle: "학생회", icon: MapPinned, accent: "text-blue-500" },
  { title: "학생회 공지", subtitle: "학생회", icon: Users, accent: "text-cyan-500" },
];

export const howItWorksSteps = [
  {
    eyebrow: "Step 1",
    title: "워크스페이스를 준비해요",
    description: "팀을 만들고 멤버를 초대해 앱 등록과 배포를 함께 관리할 운영 공간을 정리합니다.",
  },
  {
    eyebrow: "Step 2",
    title: "SDK로 미니앱을 개발해요",
    description: "Union SDK와 Bridge API를 사용해 인증, UI, 디바이스 기능을 미니앱 안에 연결합니다.",
  },
  {
    eyebrow: "Step 3",
    title: "업로드 후 심사를 요청해요",
    description: ".unionapp 빌드를 업로드하고 QR 테스트를 완료한 뒤 심사 요청과 승인 후 배포를 진행합니다.",
  },
];

export const useCases = [
  {
    title: "학생회 운영 허브",
    description: "투표, 공지, 행사 신청처럼 반복되는 학생회 운영 업무를 하나의 미니앱 경험으로 정리합니다.",
    image: "/landing/student-council.webp",
  },
  {
    title: "캠퍼스 서비스 출시",
    description: "생활 편의, 정보 탐색, 모집형 서비스를 슈퍼앱 안에 배포하고 버전 단위로 개선합니다.",
    image: "/landing/easy-launch.webp",
  },
  {
    title: "기존 운영 방식 전환",
    description: "폼, 메신저, 게시판에 흩어진 캠퍼스 운영 절차를 미니앱 흐름으로 정리합니다.",
    image: "/landing/compare-stores.webp",
  },
];

export const faqItems = [
  {
    question: "개발자가 있어야 사용할 수 있나요?",
    answer: "미니앱은 SDK 기반으로 개발해 업로드하는 구조입니다. 다만 운영자는 워크스페이스에서 멤버를 초대하고, 업로드·심사·배포 흐름을 함께 관리할 수 있습니다.",
  },
  {
    question: "어떤 조직이 가장 잘 맞나요?",
    answer: "학생회, 동아리, 학과, 교내 프로젝트 팀처럼 대학생 대상 공지나 참여 흐름이 있는 조직에 적합합니다.",
  },
  {
    question: "출시는 어떤 절차로 진행되나요?",
    answer: "워크스페이스에서 앱을 등록하고 .unionapp 빌드를 업로드한 뒤, 테스트를 완료하고 심사를 요청합니다. 승인된 버전은 퍼블리셔 콘솔에서 배포할 수 있습니다.",
  },
  {
    question: "출시 후에도 버전을 관리할 수 있나요?",
    answer: "가능합니다. 앱 상세와 버전 이력에서 업로드, 테스트, 심사 요청, 반려 대응, 배포 상태를 계속 확인할 수 있습니다.",
  },
];
