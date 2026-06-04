import { MemberRole } from "@/types/workspace";
import type { MiniAppStatus, PermissionScope, VersionStatus } from "@/types/app-version";

// 정본 권한 스코프 (닷-표기 7개) — SDK · iOS · Spring PermissionScope 와 동일.
export const PERMISSION_LABELS: Record<PermissionScope, { label: string; description: string }> = {
  "user.profile": {
    label: "사용자 프로필",
    description: "사용자의 이름, 프로필 이미지 등 기본 정보를 조회합니다.",
  },
  "user.email": {
    label: "이메일",
    description: "사용자의 이메일 주소를 조회합니다.",
  },
  "user.university": {
    label: "학교 정보",
    description: "사용자의 소속 대학교 정보를 조회합니다.",
  },
  "device.location": {
    label: "위치 정보",
    description: "사용자의 현재 위치 정보를 조회합니다.",
  },
  "device.camera": {
    label: "카메라",
    description: "기기의 카메라에 접근합니다. (QR 스캔 등)",
  },
  "device.storage": {
    label: "저장소",
    description: "미니앱 전용 로컬 저장소에 데이터를 읽고 씁니다.",
  },
  notification: {
    label: "알림",
    description: "사용자에게 푸시 알림을 발송합니다.",
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

export const MINI_APP_STATUS_LABELS: Record<MiniAppStatus, string> = {
  PENDING: "대기 중",
  APPROVED: "승인됨",
};

export const MINI_APP_STATUS_COLORS: Record<MiniAppStatus, { dot: string; bg: string }> = {
  PENDING: { dot: "bg-gold", bg: "bg-gold/10 text-gold" },
  APPROVED: { dot: "bg-sage", bg: "bg-sage/10 text-sage" },
};
