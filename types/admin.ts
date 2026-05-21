import type {
  VersionStatus,
  MiniAppStatus as RealMiniAppStatus,
} from "@/types/app-version";
import type {
  MiniAppCategory,
  MiniAppStatus as LegacyMiniAppStatus,
  PermissionScope,
} from "@/types/mini-app";

export interface AdminReviewScanSummary {
  security: "pass" | "warning";
  performance: "pass" | "warning";
  notes: string[];
}

export interface AdminReviewRecord {
  id: string;
  appId: string;
  appName: string;
  publisherId: string;
  publisherName: string;
  publisherEmail: string;
  contactEmail: string;
  category: MiniAppCategory;
  shortDescription: string;
  version: string;
  status: LegacyMiniAppStatus;
  submittedAt: string;
  reviewedAt?: string;
  releaseNote: string;
  reviewerNote?: string;
  rejectionReasons?: string[];
  permissions: PermissionScope[];
  autoScanSummary: AdminReviewScanSummary;
}

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

export interface AdminPublisherRecord {
  id: string;
  email: string;
  name: string;
  contactEmail?: string | null;
  status: AdminPublisherStatus;
  createdAt: string;
  appCount: number;
  publishedAppCount: number;
  inReviewAppCount: number;
  role: AdminPublisherRole;
  recentApps: {
    id: string;
    name: string;
    status: LegacyMiniAppStatus;
    version: string;
  }[];
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
  category?: MiniAppCategory;
  status: RealMiniAppStatus;
  currentVersion: string | null;
  currentVersionStatus?: VersionStatus | null;
  updatedAt: string;
  reportCount?: number;
  forcedActionNote?: string;
}

export interface AdminMiniAppStatusUpdateResponse {
  miniAppId: number;
  status: RealMiniAppStatus;
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

export interface AdminReportRecord {
  id: string;
  targetType: "miniapp" | "review";
  targetName: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  detail: string;
  status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  actionTaken?: "warning" | "suspend" | "delete";
}

export interface AdminUserReportRecord {
  id: string;
  reportedUserName: string;
  reportedUserEmail: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  detail: string;
  status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  actionTaken?: "warning" | "suspend" | "dismiss";
}
