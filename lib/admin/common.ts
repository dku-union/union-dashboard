import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { appVersions, miniApps, publishers, workspaces } from "@/lib/db/schema";
import type { VersionStatus } from "@/types/app-version";

const KNOWN_VERSION_STATUSES = new Set<VersionStatus>([
  "DRAFT",
  "UPLOADED",
  "IN_REVIEW",
  "ACCEPTED",
  "REJECTED",
  "DEPLOYED",
]);

export interface AdminMiniAppLatestVersionRow {
  miniAppId: number;
  miniAppName: string;
  miniAppStatus: "PENDING" | "APPROVED";
  miniAppUpdatedAt: Date;
  publisherId: string | null;
  publisherName: string | null;
  publisherEmail: string | null;
  contactEmail: string | null;
  versionId: string | null;
  versionNumber: string | null;
  versionStatus: VersionStatus | null;
  versionCreatedAt: Date | null;
}

export function toIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export function asVersionStatus(value: string | null | undefined): VersionStatus | null {
  if (!value || !KNOWN_VERSION_STATUSES.has(value as VersionStatus)) {
    return null;
  }

  return value as VersionStatus;
}

export async function listMiniAppsWithLatestVersion(): Promise<AdminMiniAppLatestVersionRow[]> {
  const appRows = await db
    .select({
      miniAppId: miniApps.id,
      miniAppName: miniApps.name,
      miniAppStatus: miniApps.status,
      miniAppUpdatedAt: miniApps.updatedAt,
      publisherId: publishers.publisherId,
      publisherName: publishers.name,
      publisherEmail: publishers.email,
      contactEmail: workspaces.contactEmail,
    })
    .from(miniApps)
    .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
    .leftJoin(publishers, eq(workspaces.ownerId, publishers.publisherId));

  if (appRows.length === 0) {
    return [];
  }

  const versionRows = await db
    .select({
      versionId: appVersions.id,
      miniAppId: appVersions.miniAppId,
      versionNumber: appVersions.versionNumber,
      versionStatus: appVersions.status,
      versionCreatedAt: appVersions.createdAt,
    })
    .from(appVersions)
    .where(inArray(appVersions.miniAppId, appRows.map((row) => row.miniAppId)))
    .orderBy(desc(appVersions.createdAt));

  const latestVersionByApp = new Map<number, (typeof versionRows)[number]>();
  for (const version of versionRows) {
    if (!latestVersionByApp.has(version.miniAppId)) {
      latestVersionByApp.set(version.miniAppId, version);
    }
  }

  return appRows.map((app) => {
    const latestVersion = latestVersionByApp.get(app.miniAppId);

    return {
      ...app,
      miniAppStatus: app.miniAppStatus as "PENDING" | "APPROVED",
      versionId: latestVersion?.versionId ?? null,
      versionNumber: latestVersion?.versionNumber ?? null,
      versionStatus: asVersionStatus(latestVersion?.versionStatus),
      versionCreatedAt: latestVersion?.versionCreatedAt ?? null,
    };
  });
}

