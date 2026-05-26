import type { MiniAppStatus, VersionStatus } from "@/types/app-version";

export type AdminPublisherStatus = "ACTIVE" | "SUSPENDED" | "PENDING";
export type AdminPublisherRole = "ROLE_USER" | "ROLE_ADMIN";

export interface AdminDashboardStat {
  label: string;
  value: number;
}

export interface AdminDashboardReviewItem {
  versionId: string;
  miniAppName: string;
  publisherName: string | null;
  versionNumber: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewReason: string | null;
}

export interface AdminDashboardPublisherItem {
  id: string;
  name: string;
  email: string;
  status: AdminPublisherStatus;
  inReviewAppCount: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStat[];
  recentReviews: AdminDashboardReviewItem[];
  rejectedReviews: AdminDashboardReviewItem[];
  attentionPublishers: AdminDashboardPublisherItem[];
}

export type AdminReportTargetType = "MINI_APP" | "REVIEW" | "USER";
export type AdminReportStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
export type AdminReportReason =
  | "POLICY_VIOLATION"
  | "HARASSMENT"
  | "SCAM"
  | "SPAM"
  | "INAPPROPRIATE_CONTENT"
  | "COPYRIGHT"
  | "OTHER";

export interface AdminReportRecord {
  id: string;
  targetType: AdminReportTargetType;
  targetLabel: string;
  targetSubLabel: string | null;
  reporterName: string;
  reporterEmail: string;
  reason: AdminReportReason;
  detail: string | null;
  status: AdminReportStatus;
  actionTaken: string;
  reviewedByName: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReportListResponse {
  reports: AdminReportRecord[];
}

export interface AdminReportUpdateResponse {
  report: Pick<
    AdminReportRecord,
    "id" | "status" | "actionTaken" | "reviewedByName" | "reviewedAt" | "updatedAt"
  >;
}

export interface AdminPublisherRecentApp {
  id: string;
  name: string;
  versionId: string | null;
  version: string | null;
  versionStatus: VersionStatus | null;
}

export interface AdminPublisherListItem {
  id: string;
  email: string;
  name: string;
  contactEmail: string | null;
  status: AdminPublisherStatus;
  createdAt: string;
  appCount: number;
  publishedAppCount: number;
  inReviewAppCount: number;
  role: AdminPublisherRole;
}

export interface AdminPublisherDetail extends AdminPublisherListItem {
  recentApps: AdminPublisherRecentApp[];
}

export interface AdminPublisherStatusUpdateResponse {
  publisherId: string;
  status: AdminPublisherStatus;
  updatedAt: string;
}

export interface AdminManagedAppRecord {
  id: number;
  name: string;
  publisherId?: string | null;
  publisherName: string | null;
  publisherEmail: string | null;
  status: MiniAppStatus;
  currentVersion: string | null;
  currentVersionStatus?: VersionStatus | null;
  updatedAt: string;
  reportCount?: number;
  forcedActionNote?: string;
}

export interface AdminMiniAppStatusUpdateResponse {
  miniAppId: number;
  status: MiniAppStatus;
  updatedAt: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  university?: string;
  verified: boolean;
  status: AdminPublisherStatus;
  role: AdminPublisherRole | "USER" | "PUBLISHER" | "ADMIN";
  createdAt: string;
}

export interface AdminRoleRecord {
  id: string;
  name: string;
  email: string;
  adminRole: "ROLE_ADMIN" | "SUPER_ADMIN" | "REVIEW_ADMIN";
  assignedAt: string;
}

export interface AdminUserListResponse {
  users: AdminUserRecord[];
  admins: AdminRoleRecord[];
}

export interface AdminUserStatusUpdateResponse {
  userId: string;
  status: AdminPublisherStatus;
  updatedAt: string;
}

