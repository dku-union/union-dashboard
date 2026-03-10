import { MiniAppStatus } from "./mini-app";

export interface ReviewRecord {
  id: string;
  appId: string;
  appName: string;
  appIconUrl?: string;
  version: string;
  status: MiniAppStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
  rejectionReasons?: string[];
}
