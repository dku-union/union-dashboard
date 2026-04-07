export const ADMIN_REVIEWABLE_VERSION_STATUSES = [
  "UPLOADED",
  "IN_REVIEW",
  "ACCEPTED",
  "REJECTED",
  "DEPLOYED",
] as const;

export const ADMIN_REVIEW_DECISIONABLE_STATUSES = ["IN_REVIEW"] as const;

export const REVIEW_VERDICTS = ["ACCEPTED", "REJECTED"] as const;

export type AdminReviewVersionStatus =
  | "DRAFT"
  | "UPLOADED"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "DEPLOYED";

export type ReviewVerdict = (typeof REVIEW_VERDICTS)[number];

export interface AdminReviewListItem {
  versionId: string;
  reviewId: string | null;
  miniAppId: number;
  miniAppName: string;
  miniAppStatus: string;
  versionNumber: string;
  versionStatus: AdminReviewVersionStatus;
  publisherId: string | null;
  publisherName: string | null;
  publisherEmail: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewVerdict: ReviewVerdict | null;
  reviewReason: string | null;
}

export interface AdminReviewHistoryItem {
  reviewId: string;
  versionId: string;
  versionNumber: string;
  verdict: ReviewVerdict;
  reason: string | null;
  reviewedAt: string | null;
  reviewerId: string | null;
  reviewerName: string | null;
  reviewerEmail: string | null;
}

export interface AdminReviewDetail extends AdminReviewListItem {
  miniAppDescription: string | null;
  miniAppIconUrl: string | null;
  workspaceId: string;
  contactEmail: string;
  releaseNotes: string | null;
  buildFileUrl: string | null;
  bundleSize: number | null;
  testedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reviewHistory: AdminReviewHistoryItem[];
}

export interface AdminApproveReviewResponse {
  versionId: string;
  reviewId: string;
  versionStatus: "ACCEPTED";
  miniAppStatus: "APPROVED";
  reviewedAt: string;
}

export interface AdminRejectReviewRequest {
  reason: string;
}

export interface AdminRejectReviewResponse {
  versionId: string;
  reviewId: string;
  versionStatus: "REJECTED";
  reviewedAt: string;
  reason: string;
}
