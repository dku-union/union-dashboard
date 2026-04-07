import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { appVersions, miniApps, publishers, reviews, workspaces } from "@/lib/db/schema";
import type {
  AdminReviewDetail,
  AdminReviewHistoryItem,
  AdminReviewListItem,
  AdminReviewVersionStatus,
} from "@/types/admin-review";
import { ADMIN_REVIEWABLE_VERSION_STATUSES } from "@/types/admin-review";

function toIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

function mapReviewListItem(row: {
  versionId: string;
  reviewId: string | null;
  miniAppId: number;
  miniAppName: string;
  miniAppStatus: string;
  versionNumber: string;
  versionStatus: string;
  publisherId: string | null;
  publisherName: string | null;
  publisherEmail: string | null;
  createdAt: Date;
  decidedAt: Date | null;
  reviewVerdict: string | null;
  reviewReason: string | null;
}): AdminReviewListItem {
  return {
    versionId: row.versionId,
    reviewId: row.reviewId,
    miniAppId: row.miniAppId,
    miniAppName: row.miniAppName,
    miniAppStatus: row.miniAppStatus,
    versionNumber: row.versionNumber,
    versionStatus: row.versionStatus as AdminReviewVersionStatus,
    publisherId: row.publisherId,
    publisherName: row.publisherName,
    publisherEmail: row.publisherEmail,
    submittedAt: row.createdAt.toISOString(),
    reviewedAt: toIsoString(row.decidedAt),
    reviewVerdict: (row.reviewVerdict as AdminReviewListItem["reviewVerdict"]) ?? null,
    reviewReason: row.reviewReason,
  };
}

export function buildAdminReviewFilters(status?: string, query?: string) {
  const filters = [
    status
      ? eq(appVersions.status, status)
      : inArray(appVersions.status, [...ADMIN_REVIEWABLE_VERSION_STATUSES]),
  ];

  if (query) {
    const pattern = `%${query}%`;
    const searchFilter = or(
      ilike(miniApps.name, pattern),
      ilike(publishers.name, pattern),
      ilike(publishers.email, pattern),
      ilike(appVersions.versionNumber, pattern),
    );

    if (searchFilter) {
      filters.push(searchFilter);
    }
  }

  return filters;
}

export async function listAdminReviews(status?: string, query?: string) {
  const filters = buildAdminReviewFilters(status, query);

  const rows = await db
    .select({
      versionId: appVersions.id,
      reviewId: reviews.id,
      miniAppId: miniApps.id,
      miniAppName: miniApps.name,
      miniAppStatus: miniApps.status,
      versionNumber: appVersions.versionNumber,
      versionStatus: appVersions.status,
      publisherId: publishers.publisherId,
      publisherName: publishers.name,
      publisherEmail: publishers.email,
      createdAt: appVersions.createdAt,
      decidedAt: reviews.decidedAt,
      reviewVerdict: reviews.verdict,
      reviewReason: reviews.reason,
    })
    .from(appVersions)
    .innerJoin(miniApps, eq(appVersions.miniAppId, miniApps.id))
    .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
    .leftJoin(publishers, eq(workspaces.ownerId, publishers.publisherId))
    .leftJoin(reviews, eq(reviews.versionId, appVersions.id))
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(appVersions.createdAt));

  return rows.map(mapReviewListItem);
}

export async function getAdminReviewDetail(versionId: string): Promise<AdminReviewDetail | null> {
  const [row] = await db
    .select({
      versionId: appVersions.id,
      reviewId: reviews.id,
      miniAppId: miniApps.id,
      miniAppName: miniApps.name,
      miniAppStatus: miniApps.status,
      miniAppDescription: miniApps.description,
      miniAppIconUrl: miniApps.iconUrl,
      versionNumber: appVersions.versionNumber,
      versionStatus: appVersions.status,
      publisherId: publishers.publisherId,
      publisherName: publishers.name,
      publisherEmail: publishers.email,
      workspaceId: workspaces.workspaceId,
      contactEmail: workspaces.contactEmail,
      releaseNotes: appVersions.releaseNotes,
      buildFileUrl: appVersions.buildFileUrl,
      bundleSize: appVersions.bundleSize,
      testedAt: appVersions.testedAt,
      createdAt: appVersions.createdAt,
      updatedAt: appVersions.updatedAt,
      decidedAt: reviews.decidedAt,
      reviewVerdict: reviews.verdict,
      reviewReason: reviews.reason,
    })
    .from(appVersions)
    .innerJoin(miniApps, eq(appVersions.miniAppId, miniApps.id))
    .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
    .leftJoin(publishers, eq(workspaces.ownerId, publishers.publisherId))
    .leftJoin(reviews, eq(reviews.versionId, appVersions.id))
    .where(eq(appVersions.id, versionId))
    .orderBy(desc(reviews.createdAt))
    .limit(1);

  if (!row) {
    return null;
  }

  const historyRows = await db
    .select({
      reviewId: reviews.id,
      versionId: reviews.versionId,
      versionNumber: appVersions.versionNumber,
      verdict: reviews.verdict,
      reason: reviews.reason,
      reviewedAt: reviews.decidedAt,
      reviewerId: reviews.reviewerId,
      reviewerName: publishers.name,
      reviewerEmail: publishers.email,
    })
    .from(reviews)
    .innerJoin(appVersions, eq(reviews.versionId, appVersions.id))
    .leftJoin(publishers, eq(reviews.reviewerId, publishers.publisherId))
    .where(eq(appVersions.miniAppId, row.miniAppId))
    .orderBy(desc(reviews.createdAt));

  const reviewHistory: AdminReviewHistoryItem[] = historyRows.map((item) => ({
    reviewId: item.reviewId,
    versionId: item.versionId,
    versionNumber: item.versionNumber,
    verdict: item.verdict as AdminReviewHistoryItem["verdict"],
    reason: item.reason,
    reviewedAt: toIsoString(item.reviewedAt),
    reviewerId: item.reviewerId,
    reviewerName: item.reviewerName,
    reviewerEmail: item.reviewerEmail,
  }));

  return {
    ...mapReviewListItem({
      versionId: row.versionId,
      reviewId: row.reviewId,
      miniAppId: row.miniAppId,
      miniAppName: row.miniAppName,
      miniAppStatus: row.miniAppStatus,
      versionNumber: row.versionNumber,
      versionStatus: row.versionStatus,
      publisherId: row.publisherId,
      publisherName: row.publisherName,
      publisherEmail: row.publisherEmail,
      createdAt: row.createdAt,
      decidedAt: row.decidedAt,
      reviewVerdict: row.reviewVerdict,
      reviewReason: row.reviewReason,
    }),
    miniAppDescription: row.miniAppDescription,
    miniAppIconUrl: row.miniAppIconUrl,
    workspaceId: row.workspaceId,
    contactEmail: row.contactEmail,
    releaseNotes: row.releaseNotes,
    buildFileUrl: row.buildFileUrl,
    bundleSize: row.bundleSize,
    testedAt: toIsoString(row.testedAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    reviewHistory,
  };
}

export async function getAdminReviewDecisionTarget(versionId: string) {
  const [row] = await db
    .select({
      versionId: appVersions.id,
      versionStatus: appVersions.status,
      miniAppId: miniApps.id,
      miniAppStatus: miniApps.status,
      existingReviewId: reviews.id,
    })
    .from(appVersions)
    .innerJoin(miniApps, eq(appVersions.miniAppId, miniApps.id))
    .leftJoin(reviews, eq(reviews.versionId, appVersions.id))
    .where(eq(appVersions.id, versionId))
    .orderBy(desc(reviews.createdAt))
    .limit(1);

  return row ?? null;
}
