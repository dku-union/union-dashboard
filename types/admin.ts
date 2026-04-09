import type { VersionStatus } from "@/types/app-version";
import type { MiniAppCategory, MiniAppStatus, PermissionScope } from "@/types/mini-app";

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
  status: MiniAppStatus;
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

export interface AdminPublisherStatusUpdateResponse {
  publisherId: string;
  status: AdminPublisherStatus;
  updatedAt: string;
}

export interface AdminManagedAppRecord {
  id: number;
  name: string;
  publisherId: string | null;
  publisherName: string | null;
  publisherEmail: string | null;
  status: "PENDING" | "APPROVED";
  currentVersion: string | null;
  currentVersionStatus: VersionStatus | null;
  updatedAt: string;
}

export interface AdminMiniAppStatusUpdateResponse {
  miniAppId: number;
  status: "PENDING" | "APPROVED";
  updatedAt: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  status: AdminPublisherStatus;
  role: AdminPublisherRole;
  createdAt: string;
}

export interface AdminRoleRecord {
  id: string;
  name: string;
  email: string;
  adminRole: "ROLE_ADMIN";
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
