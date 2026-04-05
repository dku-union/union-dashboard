import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { miniApps, workspaceMembers, workspaces } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
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

    return NextResponse.json(
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
    );
  } catch (error) {
    console.error("GET /api/mini-apps/my-apps error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
