export type MemberRole = "owner" | "admin" | "developer" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarUrl?: string;
  joinedAt: string;
  lastActiveAt: string;
  assignedApps: string[]; // mini-app IDs
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  ownerId: string;
  members: TeamMember[];
  appIds: string[]; // mini-app IDs belonging to this workspace
}
