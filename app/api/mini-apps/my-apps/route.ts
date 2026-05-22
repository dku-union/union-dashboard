import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { miniApps, workspaceMembers, workspaces } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const rows = await db
      .select({
        id: miniApps.id,
        name: miniApps.name,
        description: miniApps.description,
        iconUrl: miniApps.iconUrl,
        status: miniApps.status,
        workspaceId: miniApps.workspaceId,
        createdAt: miniApps.createdAt,
        updatedAt: miniApps.updatedAt,
        workspaceName: workspaces.name,
        workspaceColor: workspaces.color,
      })
      .from(miniApps)
      .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
      .innerJoin(
        workspaceMembers,
        eq(workspaces.workspaceId, workspaceMembers.workspaceId),
      )
      .where(eq(workspaceMembers.publisherId, session.id))
      .orderBy(desc(miniApps.updatedAt));

    return jsonData(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        iconUrl: r.iconUrl,
        status: r.status,
        workspaceId: r.workspaceId,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        workspaceName: r.workspaceName,
        workspaceColor: r.workspaceColor ?? "#2563EB",
      })),
      requestId,
    );
  } catch (error) {
    return serverError("mini_app.my_apps.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
