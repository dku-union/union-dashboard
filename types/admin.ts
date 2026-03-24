import { MiniAppCategory, MiniAppStatus, PermissionScope } from "@/types/mini-app";

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

export interface AdminPublisherRecord {
  id: string;
  email: string;
  name: string;
  contactEmail?: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  createdAt: string;
  appCount: number;
  publishedAppCount: number;
  inReviewAppCount: number;
  role: "ROLE_USER" | "ROLE_ADMIN";
  recentApps: {
    id: string;
    name: string;
    status: MiniAppStatus;
    version: string;
  }[];
}

export interface AdminManagedAppRecord {
  id: string;
  name: string;
  publisherName: string;
  publisherEmail: string;
  category: MiniAppCategory;
  status: MiniAppStatus;
  currentVersion: string;
  updatedAt: string;
  reportCount: number;
  forcedActionNote?: string;
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

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  university: string;
  verified: boolean;
  status: "ACTIVE" | "SUSPENDED";
  role: "USER" | "PUBLISHER" | "ADMIN";
  createdAt: string;
}

export interface AdminRoleRecord {
  id: string;
  name: string;
  email: string;
  adminRole: "SUPER_ADMIN" | "REVIEW_ADMIN";
  assignedAt: string;
}
