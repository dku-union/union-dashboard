import { Workspace, TeamMember } from "@/types/workspace";

const devTeamMembers: TeamMember[] = [
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

const commerceMembers: TeamMember[] = [
  {
    id: "member-c1",
    name: "김단국",
    email: "dankok@dankook.ac.kr",
    role: "owner",
    joinedAt: "2024-05-01",
    lastActiveAt: "2025-03-10",
    assignedApps: ["app-c1", "app-c2"],
  },
  {
    id: "member-c2",
    name: "한지우",
    email: "jiwoo@partner.com",
    role: "developer",
    joinedAt: "2024-05-15",
    lastActiveAt: "2025-03-09",
    assignedApps: ["app-c1"],
  },
  {
    id: "member-c3",
    name: "송태현",
    email: "taehyun@partner.com",
    role: "developer",
    joinedAt: "2024-06-01",
    lastActiveAt: "2025-03-08",
    assignedApps: ["app-c2"],
  },
];

const labMembers: TeamMember[] = [
  {
    id: "member-l1",
    name: "김단국",
    email: "dankok@dankook.ac.kr",
    role: "owner",
    joinedAt: "2024-08-01",
    lastActiveAt: "2025-03-10",
    assignedApps: ["app-l1"],
  },
  {
    id: "member-l2",
    name: "윤채원",
    email: "chaewon@lab.ac.kr",
    role: "admin",
    joinedAt: "2024-08-15",
    lastActiveAt: "2025-03-09",
    assignedApps: ["app-l1"],
  },
];

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "단국대 개발팀",
    description: "단국대학교 미니앱 개발 워크스페이스",
    createdAt: "2024-01-15",
    ownerId: "member-1",
    members: devTeamMembers,
    appIds: ["app-1", "app-2", "app-3", "app-4", "app-5", "app-6"],
    color: "#2563EB",
  },
  {
    id: "ws-2",
    name: "커머스 프로젝트",
    description: "외부 파트너사와 함께하는 커머스 미니앱 개발",
    createdAt: "2024-05-01",
    ownerId: "member-c1",
    members: commerceMembers,
    appIds: ["app-c1", "app-c2"],
    color: "#10B981",
  },
  {
    id: "ws-3",
    name: "AI 연구실",
    description: "AI 기반 캠퍼스 서비스 실험 프로젝트",
    createdAt: "2024-08-01",
    ownerId: "member-l1",
    members: labMembers,
    appIds: ["app-l1"],
    color: "#6366F1",
  },
];

// Backward compatibility
export const mockWorkspace = mockWorkspaces[0];
export const mockMembers = devTeamMembers;
