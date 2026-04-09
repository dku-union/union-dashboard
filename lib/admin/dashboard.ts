import { and, count, desc, eq, inArray, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { appVersions, miniApps, publishers, reviews, workspaces } from "@/lib/db/schema";
import type { AdminDashboardData } from "@/types/admin";

function toReviewItem(row: {
  versionId: string;
  miniAppName: string;
  publisherName: string | null;
  versionNumber: string;
  createdAt: Date;
  decidedAt: Date | null;
  reason: string | null;
}) {
  return {
    versionId: row.versionId,
    miniAppName: row.miniAppName,
    publisherName: row.publisherName,
    versionNumber: row.versionNumber,
    submittedAt: row.createdAt.toISOString(),
    reviewedAt: row.decidedAt?.toISOString() ?? null,
    reviewReason: row.reason,
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [publisherCountRow] = await db.select({ value: count() }).from(publishers);
  const [miniAppCountRow] = await db.select({ value: count() }).from(miniApps);
  const [inReviewCountRow] = await db
    .select({ value: count() })
    .from(appVersions)
    .where(eq(appVersions.status, "IN_REVIEW"));

  const recentReviewRows = await db
    .select({
      versionId: appVersions.id,
      miniAppName: miniApps.name,
      publisherName: publishers.name,
      versionNumber: appVersions.versionNumber,
      createdAt: appVersions.createdAt,
      decidedAt: reviews.decidedAt,
      reason: reviews.reason,
    })
    .from(appVersions)
    .innerJoin(miniApps, eq(appVersions.miniAppId, miniApps.id))
    .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
    .leftJoin(publishers, eq(workspaces.ownerId, publishers.publisherId))
    .leftJoin(reviews, eq(reviews.versionId, appVersions.id))
    .where(eq(appVersions.status, "IN_REVIEW"))
    .orderBy(desc(appVersions.createdAt))
    .limit(3);

  const rejectedReviewRows = await db
    .select({
      versionId: appVersions.id,
      miniAppName: miniApps.name,
      publisherName: publishers.name,
      versionNumber: appVersions.versionNumber,
      createdAt: appVersions.createdAt,
      decidedAt: reviews.decidedAt,
      reason: reviews.reason,
    })
    .from(reviews)
    .innerJoin(appVersions, eq(reviews.versionId, appVersions.id))
    .innerJoin(miniApps, eq(appVersions.miniAppId, miniApps.id))
    .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
    .leftJoin(publishers, eq(workspaces.ownerId, publishers.publisherId))
    .where(and(eq(reviews.verdict, "REJECTED"), eq(appVersions.status, "REJECTED")))
    .orderBy(desc(reviews.decidedAt), desc(appVersions.createdAt))
    .limit(3);

  const attentionPublisherRows = await db
    .select({
      id: publishers.publisherId,
      name: publishers.name,
      email: publishers.email,
      status: publishers.pubstatus,
    })
    .from(publishers)
    .where(or(ne(publishers.pubstatus, "ACTIVE"), eq(publishers.role, "ROLE_ADMIN")))
    .orderBy(desc(publishers.createdAt))
    .limit(6);

  const attentionPublisherIds = attentionPublisherRows.map((row) => row.id);
  const reviewCountRows = attentionPublisherIds.length
    ? await db
        .select({
          publisherId: publishers.publisherId,
          count: count(),
        })
        .from(appVersions)
        .innerJoin(miniApps, eq(appVersions.miniAppId, miniApps.id))
        .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
        .innerJoin(publishers, eq(workspaces.ownerId, publishers.publisherId))
        .where(
          and(
            inArray(publishers.publisherId, attentionPublisherIds),
            eq(appVersions.status, "IN_REVIEW"),
          ),
        )
        .groupBy(publishers.publisherId)
    : [];

  const inReviewCountByPublisher = new Map(
    reviewCountRows.map((row) => [row.publisherId, Number(row.count)]),
  );

  return {
    stats: [
      { label: "총 사용자", value: Number(publisherCountRow?.value ?? 0) },
      { label: "전체 앱", value: Number(miniAppCountRow?.value ?? 0) },
      { label: "심사 대기", value: Number(inReviewCountRow?.value ?? 0) },
    ],
    recentReviews: recentReviewRows.map(toReviewItem),
    rejectedReviews: rejectedReviewRows.map(toReviewItem),
    attentionPublishers: attentionPublisherRows
      .filter((row) => row.status !== "ACTIVE")
      .slice(0, 3)
      .map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        status: row.status,
        inReviewAppCount: inReviewCountByPublisher.get(row.id) ?? 0,
      })),
  };
}

