export type MiniAppStatus = "draft" | "in_review" | "rejected" | "published" | "suspended";

export type MiniAppCategory =
  | "food"
  | "education"
  | "marketplace"
  | "social"
  | "transport"
  | "utility"
  | "entertainment"
  | "health";

export type PermissionScope =
  | "user.profile"
  | "user.student_info"
  | "payment"
  | "location"
  | "notification"
  | "camera"
  | "share";

export interface MiniAppVersion {
  id: string;
  appId: string;
  version: string;
  status: MiniAppStatus;
  buildFileUrl?: string;
  buildFileName?: string;
  releaseNote: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface MiniApp {
  id: string;
  publisherId: string;
  name: string;
  shortDescription: string;
  description: string;
  category: MiniAppCategory;
  keywords: string[];
  permissions: PermissionScope[];
  iconUrl?: string;
  screenshotUrls: string[];
  status: MiniAppStatus;
  currentVersion: string;
  versions: MiniAppVersion[];
  createdAt: string;
  updatedAt: string;
}
