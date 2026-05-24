import { and, count, countDistinct, desc, eq, gte, lte, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { miniApps, miniAppUsages, workspaceMembers } from "@/lib/db/schema";
import type { AnalyticsRange } from "@/types/analytics";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function startOfKstDay(date: Date) {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - KST_OFFSET_MS);
}

function endOfKstDay(date: Date) {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  shifted.setUTCHours(23, 59, 59, 999);
  return new Date(shifted.getTime() - KST_OFFSET_MS);
}

function startOfKstMonth(date: Date) {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), 1) - KST_OFFSET_MS);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function resolveRange(range: AnalyticsRange) {
  const now = new Date();
  const todayStart = startOfKstDay(now);
  const todayEnd = endOfKstDay(now);

  switch (range) {
    case "today":
      return { from: todayStart, to: todayEnd };
    case "last_7_days":
      return { from: addDays(todayStart, -6), to: todayEnd };
    case "this_month":
      return { from: startOfKstMonth(now), to: todayEnd };
    case "all":
      return { from: null, to: todayEnd };
    case "last_30_days":
    default:
      return { from: addDays(todayStart, -29), to: todayEnd };
  }
}

function resolvePreviousRange(from: Date | null, to: Date) {
  if (!from) return null;
  const durationMs = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  return {
    from: new Date(previousTo.getTime() - durationMs),
    to: previousTo,
  };
}

function toTrend(change: number) {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "neutral";
}

function getChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function buildUsageConditions(workspaceId: string, from: Date | null, to: Date, miniAppId?: number) {
  return and(
    eq(miniApps.workspaceId, workspaceId),
    miniAppId ? eq(miniApps.id, miniAppId) : undefined,
    from ? gte(miniAppUsages.timestamp, from) : undefined,
    lte(miniAppUsages.timestamp, to),
  );
}

function buildUsageJoinConditions(from: Date | null, to: Date) {
  return and(
    eq(miniAppUsages.miniAppId, miniApps.id),
    from ? gte(miniAppUsages.timestamp, from) : undefined,
    lte(miniAppUsages.timestamp, to),
  );
}

async function getSummary(workspaceId: string, from: Date | null, to: Date, miniAppId?: number) {
  const [row] = await db
    .select({
      totalLaunches: count(miniAppUsages.id),
      activeUsers: countDistinct(miniAppUsages.userId),
      usedMiniApps: countDistinct(miniAppUsages.miniAppId),
    })
    .from(miniAppUsages)
    .innerJoin(miniApps, eq(miniAppUsages.miniAppId, miniApps.id))
    .where(buildUsageConditions(workspaceId, from, to, miniAppId));

  return {
    totalLaunches: Number(row?.totalLaunches ?? 0),
    activeUsers: Number(row?.activeUsers ?? 0),
    usedMiniApps: Number(row?.usedMiniApps ?? 0),
  };
}

async function getAppActiveUserCounts(workspaceId: string, from: Date, to: Date, miniAppId?: number) {
  const rows = await db
    .select({
      id: miniApps.id,
      activeUsers: countDistinct(miniAppUsages.userId),
    })
    .from(miniAppUsages)
    .innerJoin(miniApps, eq(miniAppUsages.miniAppId, miniApps.id))
    .where(buildUsageConditions(workspaceId, from, to, miniAppId))
    .groupBy(miniApps.id);

  return new Map(rows.map((row) => [row.id, Number(row.activeUsers)]));
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  const rangeParam = (searchParams.get("range") || "last_30_days") as AnalyticsRange;
  const miniAppIdParam = searchParams.get("miniAppId");
  const miniAppId = miniAppIdParam && miniAppIdParam !== "all" ? Number(miniAppIdParam) : undefined;

  if (!workspaceId) {
    return jsonError("workspaceId가 필요합니다.", 400, requestId, "MISSING_WORKSPACE_ID");
  }
  if (miniAppId !== undefined && Number.isNaN(miniAppId)) {
    return jsonError("유효하지 않은 miniAppId입니다.", 400, requestId, "INVALID_MINI_APP_ID");
  }

  const range = ["today", "last_7_days", "last_30_days", "this_month", "all"].includes(rangeParam)
    ? rangeParam
    : "last_30_days";
  const { from, to } = resolveRange(range);
  const now = new Date();
  const todayStart = startOfKstDay(now);
  const todayEnd = endOfKstDay(now);
  const monthStart = startOfKstMonth(now);

  try {
    const [membership] = await db
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publisherId, session.id),
        ),
      );

    if (!membership) {
      return jsonError("권한이 없습니다.", 403, requestId, "WORKSPACE_ACCESS_DENIED");
    }

    const apps = await db
      .select({ id: miniApps.id, name: miniApps.name })
      .from(miniApps)
      .where(eq(miniApps.workspaceId, workspaceId))
      .orderBy(miniApps.name);

    if (miniAppId !== undefined && !apps.some((app) => app.id === miniAppId)) {
      return jsonError(
        "워크스페이스에 속한 미니앱이 아닙니다.",
        403,
        requestId,
        "MINI_APP_NOT_IN_WORKSPACE",
      );
    }

    const currentSummary = await getSummary(workspaceId, from, to, miniAppId);
    const previousRange = resolvePreviousRange(from, to);
    const previousSummary = previousRange
      ? await getSummary(workspaceId, previousRange.from, previousRange.to, miniAppId)
      : { totalLaunches: 0, activeUsers: 0, usedMiniApps: 0 };

    const dateKey = sql<string>`to_char(${miniAppUsages.timestamp}, 'YYYY-MM-DD')`;
    const dailyRows = await db
      .select({
        date: dateKey.as("date"),
        value: count(miniAppUsages.id),
      })
      .from(miniAppUsages)
      .innerJoin(miniApps, eq(miniAppUsages.miniAppId, miniApps.id))
      .where(buildUsageConditions(workspaceId, from, to, miniAppId))
      .groupBy(dateKey)
      .orderBy(dateKey);

    const appRows = await db
      .select({
        id: miniApps.id,
        name: miniApps.name,
        launches: count(miniAppUsages.id),
        activeUsers: countDistinct(miniAppUsages.userId),
      })
      .from(miniApps)
      .leftJoin(miniAppUsages, buildUsageJoinConditions(from, to))
      .where(
        and(
          eq(miniApps.workspaceId, workspaceId),
          miniAppId ? eq(miniApps.id, miniAppId) : undefined,
        ),
      )
      .groupBy(miniApps.id, miniApps.name)
      .orderBy(desc(count(miniAppUsages.id)), miniApps.name);

    const [dauByAppId, mauByAppId] = await Promise.all([
      getAppActiveUserCounts(workspaceId, todayStart, todayEnd, miniAppId),
      getAppActiveUserCounts(workspaceId, monthStart, todayEnd, miniAppId),
    ]);

    return jsonData({
      workspaceId,
      miniAppId: miniAppId ?? "all",
      range,
      from: from?.toISOString() ?? null,
      to: to.toISOString(),
      apps,
      overview: {
        totalLaunches: {
          value: currentSummary.totalLaunches,
          change: getChange(currentSummary.totalLaunches, previousSummary.totalLaunches),
          trend: toTrend(getChange(currentSummary.totalLaunches, previousSummary.totalLaunches)),
        },
        activeUsers: {
          value: currentSummary.activeUsers,
          change: getChange(currentSummary.activeUsers, previousSummary.activeUsers),
          trend: toTrend(getChange(currentSummary.activeUsers, previousSummary.activeUsers)),
        },
        usedMiniApps: {
          value: currentSummary.usedMiniApps,
          change: getChange(currentSummary.usedMiniApps, previousSummary.usedMiniApps),
          trend: toTrend(getChange(currentSummary.usedMiniApps, previousSummary.usedMiniApps)),
        },
      },
      dailyTrend: dailyRows.map((row) => ({
        date: row.date,
        value: Number(row.value),
      })),
      appBreakdown: appRows.map((row) => ({
        id: row.id,
        name: row.name,
        launches: Number(row.launches),
        activeUsers: Number(row.activeUsers),
        dau: dauByAppId.get(row.id) ?? 0,
        mau: mauByAppId.get(row.id) ?? 0,
      })),
    }, requestId);
  } catch (error) {
    return serverError("analytics.usage.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId,
      miniAppId,
    });
  }
}
