export type MemberRole = "owner" | "admin" | "developer" | "viewer";

export interface TeamMember {
  id: number;
  publisherId: string;
  name: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  contactEmail: string;
  color: string;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  members?: TeamMember[];
}
