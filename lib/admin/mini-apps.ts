import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { miniApps } from "@/lib/db/schema";
import { listMiniAppsWithLatestVersion } from "@/lib/admin/common";
import type { AdminManagedAppRecord } from "@/types/admin";

export async function listAdminMiniApps(): Promise<AdminManagedAppRecord[]> {
  const apps = await listMiniAppsWithLatestVersion();

  return apps
    .map((app) => ({
      id: app.miniAppId,
      name: app.miniAppName,
      publisherId: app.publisherId,
      publisherName: app.publisherName,
      publisherEmail: app.publisherEmail,
      status: app.miniAppStatus,
      currentVersion: app.versionNumber,
      currentVersionStatus: app.versionStatus,
      updatedAt: app.miniAppUpdatedAt.toISOString(),
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateAdminMiniAppStatus(
  miniAppId: number,
  status: "PENDING" | "APPROVED",
) {
  const now = new Date();

  const [updated] = await db
    .update(miniApps)
    .set({
      status,
      updatedAt: now,
    })
    .where(eq(miniApps.id, miniAppId))
    .returning({ id: miniApps.id });

  return updated ? { miniAppId: updated.id, status, updatedAt: now.toISOString() } : null;
}

