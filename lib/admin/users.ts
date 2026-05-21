import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { emailVerifications, publishers } from "@/lib/db/schema";
import type { AdminRoleRecord, AdminUserListResponse, AdminUserRecord } from "@/types/admin";

export async function listAdminUsers(): Promise<AdminUserListResponse> {
  const publisherRows = await db
    .select({
      id: publishers.publisherId,
      name: publishers.name,
      email: publishers.email,
      status: publishers.pubstatus,
      role: publishers.role,
      createdAt: publishers.createdAt,
    })
    .from(publishers)
    .orderBy(desc(publishers.createdAt));

  const verificationRows = await db
    .select({
      email: emailVerifications.email,
      verified: emailVerifications.verified,
    })
    .from(emailVerifications)
    .where(eq(emailVerifications.verified, true));

  const verifiedEmails = new Set(verificationRows.map((row) => row.email.toLowerCase()));

  const users: AdminUserRecord[] = publisherRows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    verified: verifiedEmails.has(row.email.toLowerCase()),
    status: row.status,
    role: row.role,
    createdAt: row.createdAt?.toISOString() ?? new Date(0).toISOString(),
  }));

  const admins: AdminRoleRecord[] = users
    .filter((user) => user.role === "ROLE_ADMIN")
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      adminRole: "ROLE_ADMIN",
      assignedAt: user.createdAt,
    }));

  return { users, admins };
}

