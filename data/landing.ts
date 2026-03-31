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
  Rocket,
  Search,
  ShoppingBag,
  Star,
  Trophy,
  Users,
  Wrench,
  Zap,
  Coins,
} from "lucide-react";

export const landingNavItems = [
  { label: "서비스 소개", href: "#service" },
  { label: "사용 방법", href: "#how-it-works" },
  { label: "미니앱", href: "#miniapps" },
  { label: "활용 사례", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];

export const landingStats = [
  { label: "대학생 사용자", value: "200,000+" },
  { label: "등록된 미니앱", value: "50+" },
  { label: "연결된 대학", value: "300+" },
];

export const serviceHighlights = [
  {
    title: "대학생 전용 도달력",
    description: "캠퍼스 안에서 바로 쓰이는 미니앱 경험에 집중해 실제 사용자를 더 빠르게 만납니다.",
    icon: Users,
  },
  {
    title: "빠른 출시 흐름",
    description: "복잡한 앱스토어 배포보다 가볍고 빠른 형태로 새로운 아이디어를 테스트합니다.",
    icon: BadgeCheck,
  },
  {
    title: "운영과 확장까지 연결",
    description: "출시 이후에도 Union 퍼블리셔 대시보드에서 운영 데이터를 바탕으로 다음 기능을 설계합니다.",
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
    title: "간단한 등록 절차",
    description: "복잡한 심사 없이 기본 정보 입력만으로 등록 완료. 빠르면 당일 출시도 가능해요.",
    icon: Zap,
  },
  {
    title: "낮은 진입 장벽",
    description: "앱스토어/구글플레이처럼 엄격한 규약이 없어요. 대학생 서비스라면 누구나 출시 가능.",
    icon: Rocket,
  },
  {
    title: "무료로 시작",
    description: "초기 출시 비용 없음. 서비스가 성장한 후에 수익화를 고민해도 늦지 않아요.",
    icon: Coins,
  },
  {
    title: "기술 지원 제공",
    description: "개발 경험이 없어도 괜찮아요. UniApp의 SDK와 템플릿으로 빠르게 개발할 수 있어요.",
    icon: Wrench,
  },
];

export const useCases = [
  {
    title: "학생회 운영 허브",
    description: "투표, 공지, 행사 신청을 하나의 미니앱 묶음으로 제공해 학생 참여를 높입니다.",
    image: "/landing/student-council.webp",
  },
  {
    title: "캠퍼스 서비스 런칭",
    description: "새로운 생활 편의 서비스나 정보 서비스를 아이디어 단계에서 바로 검증할 수 있습니다.",
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
    question: "개발 경험이 없어도 시작할 수 있나요?",
    answer: "가능합니다. UniApp은 캠퍼스 운영자가 아이디어와 운영 목적만 정리해도 빠르게 시작할 수 있도록 설계된 미니앱 플랫폼입니다.",
  },
  {
    question: "어떤 조직이 가장 잘 맞나요?",
    answer: "학생회, 동아리, 학과, 교내 프로젝트 팀처럼 대학생 대상 공지나 참여 흐름이 있는 조직에 적합합니다.",
  },
  {
    question: "출시까지 얼마나 걸리나요?",
    answer: "기능 범위에 따라 다르지만, 기본적인 투표·공지·모집형 미니앱은 복잡한 앱스토어 배포 없이 훨씬 빠르게 검토하고 출시할 수 있습니다.",
  },
  {
    question: "기존 Union 대시보드와 어떻게 연결되나요?",
    answer: "랜딩 페이지에서 관심을 모으고, 로그인 후에는 기존 퍼블리셔 대시보드에서 앱 등록과 관리 흐름을 그대로 이어서 사용합니다.",
  },
];
