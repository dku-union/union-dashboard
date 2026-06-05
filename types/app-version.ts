export type VersionStatus =
  | "DRAFT"
  | "UPLOADED"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "DEPLOYED";

export type Verdict = "PENDING" | "ACCEPTED" | "REJECTED";

export interface AppVersion {
  id: string;
  miniAppId: number;
  miniAppName: string;
  publisherNickname: string;
  versionNumber: string;
  releaseNotes: string | null;
  status: VersionStatus;
  buildFileUrl: string | null;
  bundleSize: number | null;
  testedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVersionRequest {
  miniAppId: number;
  versionNumber: string;
  releaseNotes?: string;
}

export interface CreateVersionResponse {
  versionId: string;
  uploadUrl: string;
}

export interface Review {
  id: string;
  versionId: string;
  versionNumber: string;
  miniAppName: string;
  publisherNickname: string;
  reviewerNickname: string | null;
  verdict: Verdict;
  reason: string | null;
  submittedAt: string;
  decidedAt: string | null;
}

export interface SubmitReviewRequest {
  versionId: string;
}

export interface ReviewDecisionRequest {
  verdict: "ACCEPTED" | "REJECTED";
  reason?: string;
}

export type MiniAppStatus = "PENDING" | "APPROVED";

// 정본 권한 스코프 (닷-표기 7개) — SDK(union.config.json) · iOS · Spring PermissionScope 와 동일.
export type PermissionScope =
  | "user.profile"
  | "user.email"
  | "user.university"
  | "device.location"
  | "device.camera"
  | "device.storage"
  | "notification";

export interface MiniAppCategoryDto {
  id: number;
  name: string;
  displayName: string;
  iconUrl: string | null;
}

export interface MiniAppRecord {
  id: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
  status: MiniAppStatus;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  tags?: string | null;
  permissions?: PermissionScope[] | null;
  /** reverse-domain appId (예: com.union.soccer). Spring `MiniApp.appId`. 알림 발송 대상 식별자. */
  appId?: string | null;
}

export interface MiniAppWithWorkspace extends MiniAppRecord {
  workspaceName: string;
  workspaceColor: string;
}
