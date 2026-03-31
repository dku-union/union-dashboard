import {
  AppWindow,
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
    title: "아이디어를 정리해요",
    description: "학생에게 필요한 기능과 운영 방식을 간단히 정의하면 출발할 준비가 끝납니다.",
  },
  {
    eyebrow: "Step 2",
    title: "UniApp에서 빠르게 구성해요",
    description: "복잡한 앱스토어 절차 없이 캠퍼스에 맞는 미니앱 구조를 빠르게 조합하고 검수합니다.",
  },
  {
    eyebrow: "Step 3",
    title: "대학생에게 바로 전달해요",
    description: "학생회, 동아리, 학과 단위로 바로 배포하고 반응을 보며 다음 기능을 확장합니다.",
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
