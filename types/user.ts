export type PublisherRole = "ROLE_USER" | "ROLE_ADMIN";
export type PublisherStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface Publisher {
  id: string;
  email: string;
  name: string;

  role: PublisherRole;
  status: PublisherStatus;
  createdAt: string;
  profileImage?: string;
  hasWorkspace?: boolean;
  /** 세션 만료 시각 ISO 문자열. /api/auth/session 응답에 포함. */
  expiresAt?: string | null;
}
