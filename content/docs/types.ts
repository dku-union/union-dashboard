export type DocCategory =
  | "getting-started"
  | "development"
  | "guidelines"
  | "design"
  | "distribution";

export type BridgeModule =
  | "auth"
  | "ui"
  | "device"
  | "storage"
  | "analytics"
  | "network"
  | "navigation";

export type PermissionScope =
  | "user.profile"
  | "user.email"
  | "user.university"
  | "device.location"
  | "device.camera"
  | "device.storage";

export type ApiParam = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type ApiEndpointDoc = {
  module: BridgeModule;
  signature: string;
  description: string;
  permission?: PermissionScope;
  params?: ApiParam[];
  returns?: ApiParam[];
  example: string;
};

export type StepItem = {
  title: string;
  body?: string;
  code?: { language: string; content: string };
};

export type PermissionDoc = {
  scope: PermissionScope;
  grants: string;
  recommended: string;
  abuse: string;
};

export type ReviewSeverity = "critical" | "warning" | "info" | "manual";

export type ReviewCriteriaDoc = {
  severity: ReviewSeverity;
  problem: string;
  detection: "validate" | "manual";
  rationale: string;
  fix: string;
};

export type ChecklistDoc = {
  id: string;
  label: string;
  detail?: string;
};

export type DoDontDoc = {
  good: { label: string; example?: string };
  bad: { label: string; example?: string };
};

export type DocBlock =
  | { type: "text"; title?: string; body: string[] }
  | { type: "code"; title?: string; language: string; code: string }
  | { type: "steps"; title?: string; items: StepItem[] }
  | { type: "api"; title?: string; items: ApiEndpointDoc[] }
  | { type: "permissions"; title?: string; items: PermissionDoc[] }
  | { type: "criteria"; title?: string; items: ReviewCriteriaDoc[] }
  | { type: "checklist"; title?: string; items: ChecklistDoc[] }
  | { type: "callout"; tone: "info" | "warning" | "success"; title?: string; body: string };

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  category: DocCategory;
  updatedAt?: string;
  blocks: DocBlock[];
};
