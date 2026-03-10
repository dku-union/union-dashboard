import { Workspace, TeamMember } from "@/types/workspace";

export const mockMembers: TeamMember[] = [
  {
    id: "member-1",
    name: "김단국",
    email: "dankok@dankook.ac.kr",
    role: "owner",
    joinedAt: "2024-01-15",
    lastActiveAt: "2025-03-10",
    assignedApps: ["app-1", "app-2", "app-3", "app-4", "app-5", "app-6"],
  },
  {
    id: "member-2",
    name: "이서연",
    email: "seoyeon@dankook.ac.kr",
    role: "admin",
    joinedAt: "2024-02-20",
    lastActiveAt: "2025-03-09",
    assignedApps: ["app-1", "app-2", "app-3"],
  },
  {
    id: "member-3",
    name: "박민준",
    email: "minjun@dankook.ac.kr",
    role: "developer",
    joinedAt: "2024-03-10",
    lastActiveAt: "2025-03-08",
    assignedApps: ["app-1", "app-4"],
  },
  {
    id: "member-4",
    name: "최수아",
    email: "sua@dankook.ac.kr",
    role: "developer",
    joinedAt: "2024-04-05",
    lastActiveAt: "2025-03-10",
    assignedApps: ["app-2", "app-5"],
  },
  {
    id: "member-5",
    name: "정하윤",
    email: "hayun@dankook.ac.kr",
    role: "viewer",
    joinedAt: "2024-06-01",
    lastActiveAt: "2025-03-07",
    assignedApps: ["app-1"],
  },
];

export const mockWorkspace: Workspace = {
  id: "ws-1",
  name: "단국대 개발팀",
  description: "단국대학교 미니앱 개발 워크스페이스",
  createdAt: "2024-01-15",
  ownerId: "member-1",
  members: mockMembers,
  appIds: ["app-1", "app-2", "app-3", "app-4", "app-5", "app-6"],
};
