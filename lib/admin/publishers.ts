import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { publishers } from "@/lib/db/schema";
import { listMiniAppsWithLatestVersion } from "@/lib/admin/common";
import type {
  AdminPublisherDetail,
  AdminPublisherListItem,
  AdminPublisherRecentApp,
  AdminPublisherStatus,
} from "@/types/admin";

function mapPublisherListItem(row: {
  id: string;
  email: string;
  name: string;
  contactEmail: string | null;
  status: AdminPublisherStatus;
  createdAt: Date | null;
  role: "ROLE_USER" | "ROLE_ADMIN";
  appCount: number;
  publishedAppCount: number;
  inReviewAppCount: number;
}): AdminPublisherListItem {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    contactEmail: row.contactEmail,
    status: row.status,
    createdAt: row.createdAt?.toISOString() ?? new Date(0).toISOString(),
    role: row.role,
    appCount: row.appCount,
    publishedAppCount: row.publishedAppCount,
    inReviewAppCount: row.inReviewAppCount,
  };
}

export async function listAdminPublishers(): Promise<AdminPublisherListItem[]> {
  const publisherRows = await db
    .select({
      id: publishers.publisherId,
      email: publishers.email,
      name: publishers.name,
      status: publishers.pubstatus,
      createdAt: publishers.createdAt,
      role: publishers.role,
    })
    .from(publishers);

  const apps = await listMiniAppsWithLatestVersion();
  const statsByPublisher = new Map<
    string,
    { contactEmail: string | null; appIds: Set<number>; publishedAppCount: number; inReviewAppCount: number }
  >();

  for (const app of apps) {
    if (!app.publisherId) continue;

    const current = statsByPublisher.get(app.publisherId) ?? {
      contactEmail: app.contactEmail,
      appIds: new Set<number>(),
      publishedAppCount: 0,
      inReviewAppCount: 0,
    };

    current.contactEmail ??= app.contactEmail;
    current.appIds.add(app.miniAppId);

    if (app.versionStatus === "DEPLOYED" || app.versionStatus === "ACCEPTED") {
      current.publishedAppCount += 1;
    }

    if (app.versionStatus === "IN_REVIEW") {
      current.inReviewAppCount += 1;
    }

    statsByPublisher.set(app.publisherId, current);
  }

  return publisherRows
    .map((publisher) => {
      const stats = statsByPublisher.get(publisher.id);

      return mapPublisherListItem({
        ...publisher,
        status: publisher.status as AdminPublisherStatus,
        role: publisher.role as "ROLE_USER" | "ROLE_ADMIN",
        contactEmail: stats?.contactEmail ?? null,
        appCount: stats?.appIds.size ?? 0,
        publishedAppCount: stats?.publishedAppCount ?? 0,
        inReviewAppCount: stats?.inReviewAppCount ?? 0,
      });
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAdminPublisherDetail(
  publisherId: string,
): Promise<AdminPublisherDetail | null> {
  const publishersList = await listAdminPublishers();
  const publisher = publishersList.find((item) => item.id === publisherId);

  if (!publisher) {
    return null;
  }

  const recentApps: AdminPublisherRecentApp[] = (await listMiniAppsWithLatestVersion())
    .filter((app) => app.publisherId === publisherId)
    .sort((a, b) => b.miniAppUpdatedAt.getTime() - a.miniAppUpdatedAt.getTime())
    .slice(0, 5)
    .map((app) => ({
      id: String(app.miniAppId),
      name: app.miniAppName,
      versionId: app.versionId,
      version: app.versionNumber,
      versionStatus: app.versionStatus,
    }));

  return {
    ...publisher,
    recentApps,
  };
}

export async function updateAdminPublisherStatus(
  publisherId: string,
  status: AdminPublisherStatus,
) {
  const now = new Date();

  const [updated] = await db
    .update(publishers)
    .set({
      pubstatus: status,
    })
    .where(eq(publishers.publisherId, publisherId))
    .returning({ id: publishers.publisherId });

  return updated ? { publisherId: updated.id, status, updatedAt: now.toISOString() } : null;
}
