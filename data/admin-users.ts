import { AdminRoleRecord, AdminUserRecord } from "@/types/admin";

export const mockAdminUsers: AdminUserRecord[] = [
  {
    id: "user-001",
    name: "이장원",
    email: "weun2002@dankook.ac.kr",
    university: "단국대학교",
    verified: true,
    status: "ACTIVE",
    role: "ADMIN",
    createdAt: "2026-03-19",
  },
  {
    id: "user-002",
    name: "박학생",
    email: "park@dankook.ac.kr",
    university: "단국대학교",
    verified: true,
    status: "ACTIVE",
    role: "USER",
    createdAt: "2025-01-04",
  },
  {
    id: "user-003",
    name: "최유저",
    email: "choi@dankook.ac.kr",
    university: "단국대학교",
    verified: true,
    status: "SUSPENDED",
    role: "USER",
    createdAt: "2024-11-12",
  },
  {
    id: "user-004",
    name: "김개발",
    email: "developer@dankook.ac.kr",
    university: "단국대학교",
    verified: true,
    status: "ACTIVE",
    role: "PUBLISHER",
    createdAt: "2024-01-15",
  },
];

export const mockAdminRoles: AdminRoleRecord[] = [
  {
    id: "admin-role-001",
    name: "이장원",
    email: "weun2002@dankook.ac.kr",
    adminRole: "SUPER_ADMIN",
    assignedAt: "2026-03-19",
  },
  {
    id: "admin-role-002",
    name: "운영지원팀",
    email: "union-ops@dankook.ac.kr",
    adminRole: "REVIEW_ADMIN",
    assignedAt: "2025-12-01",
  },
];
