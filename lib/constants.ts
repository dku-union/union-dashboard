import { MiniAppCategory, MiniAppStatus, PermissionScope } from "@/types/mini-app";
import { MemberRole } from "@/types/workspace";
import type { VersionStatus, MiniAppStatus as RealMiniAppStatus } from "@/types/app-version";

export const CATEGORY_LABELS: Record<MiniAppCategory, string> = {
  food: "맛집/음식",
  education: "교육/학습",
  marketplace: "중고거래",
  social: "소셜/커뮤니티",
  transport: "교통/이동",
  utility: "유틸리티",
  entertainment: "엔터테인먼트",
  health: "건강/운동",
};

export const STATUS_LABELS: Record<MiniAppStatus, string> = {
  draft: "임시저장",
  in_review: "심사 중",
  rejected: "반려됨",
  published: "게시됨",
  suspended: "정지됨",
};

export const PERMISSION_LABELS: Record<PermissionScope, { label: string; description: string }> = {
  "user.profile": {
    label: "사용자 프로필",
    description: "사용자의 이름, 프로필 이미지 등 기본 정보를 조회합니다.",
  },
  "user.student_info": {
    label: "학생 정보",
    description: "학번, 학과, 학년 등 학생 관련 정보를 조회합니다.",
  },
  payment: {
    label: "결제",
    description: "인앱 결제를 요청합니다.",
  },
  location: {
    label: "위치 정보",
    description: "사용자의 현재 위치 정보를 조회합니다.",
  },
  notification: {
    label: "알림",
    description: "사용자에게 푸시 알림을 발송합니다.",
  },
  camera: {
    label: "카메라",
    description: "기기의 카메라에 접근합니다.",
  },
  share: {
    label: "공유",
    description: "콘텐츠를 외부 앱으로 공유합니다.",
  },
};

export const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "소유자",
  admin: "관리자",
  developer: "개발자",
  viewer: "뷰어",
};

export const ROLE_COLORS: Record<MemberRole, string> = {
  owner: "bg-union/10 text-union",
  admin: "bg-gold/10 text-gold",
  developer: "bg-sage/10 text-sage",
  viewer: "bg-muted text-muted-foreground",
};

export const VERSION_STATUS_LABELS: Record<VersionStatus, string> = {
  DRAFT: "초안",
  UPLOADED: "업로드 완료",
  IN_REVIEW: "심사 중",
  ACCEPTED: "승인됨",
  REJECTED: "반려됨",
  DEPLOYED: "배포됨",
};

export const VERSION_STATUS_COLORS: Record<VersionStatus, { dot: string; bg: string }> = {
  DRAFT: { dot: "bg-muted-foreground/50", bg: "bg-muted text-muted-foreground" },
  UPLOADED: { dot: "bg-union", bg: "bg-union/10 text-union" },
  IN_REVIEW: { dot: "bg-gold", bg: "bg-gold/10 text-gold" },
  ACCEPTED: { dot: "bg-sage", bg: "bg-sage/10 text-sage" },
  REJECTED: { dot: "bg-destructive", bg: "bg-destructive/10 text-destructive" },
  DEPLOYED: { dot: "bg-sage", bg: "bg-sage/10 text-sage" },
};

export const MINI_APP_STATUS_LABELS: Record<RealMiniAppStatus, string> = {
  PENDING: "대기 중",
  APPROVED: "승인됨",
};

export const MINI_APP_STATUS_COLORS: Record<RealMiniAppStatus, { dot: string; bg: string }> = {
  PENDING: { dot: "bg-gold", bg: "bg-gold/10 text-gold" },
  APPROVED: { dot: "bg-sage", bg: "bg-sage/10 text-sage" },
};
