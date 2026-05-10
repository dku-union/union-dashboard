import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appVersions, miniApps, workspaceMembers } from "@/lib/db/schema";

export async function getMiniAppMembership(miniAppId: number, publisherId: string) {
  const [membership] = await db
    .select({
      role: workspaceMembers.role,
      workspaceId: miniApps.workspaceId,
    })
    .from(miniApps)
    .innerJoin(workspaceMembers, eq(miniApps.workspaceId, workspaceMembers.workspaceId))
    .where(
      and(
        eq(miniApps.id, miniAppId),
        eq(workspaceMembers.publisherId, publisherId),
      ),
    )
    .limit(1);

  return membership ?? null;
}

export async function getVersionMembership(versionId: string, publisherId: string) {
  const [membership] = await db
    .select({
      role: workspaceMembers.role,
      workspaceId: miniApps.workspaceId,
      miniAppId: miniApps.id,
    })
    .from(appVersions)
    .innerJoin(miniApps, eq(appVersions.miniAppId, miniApps.id))
    .innerJoin(workspaceMembers, eq(miniApps.workspaceId, workspaceMembers.workspaceId))
    .where(
      and(
        eq(appVersions.id, versionId),
        eq(workspaceMembers.publisherId, publisherId),
      ),
    )
    .limit(1);

  return membership ?? null;
}

export function canWriteAppVersion(role: string | null | undefined) {
  return role === "owner" || role === "admin" || role === "developer";
}
