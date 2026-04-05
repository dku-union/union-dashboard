import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { miniApps, workspaceMembers, workspaces } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const miniAppId = Number(id);
  if (Number.isNaN(miniAppId)) {
    return NextResponse.json({ error: "유효하지 않은 ID입니다." }, { status: 400 });
  }

  try {
    const [row] = await db
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
      .where(eq(miniApps.id, miniAppId));

    if (!row) {
      return NextResponse.json({ error: "앱을 찾을 수 없습니다." }, { status: 404 });
    }

    // 접근 권한 확인
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, row.workspaceId),
          eq(workspaceMembers.publisherId, session.id),
        ),
      );

    if (!membership) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    return NextResponse.json({
      id: row.id,
      name: row.name,
      description: row.description,
      iconUrl: row.iconUrl,
      status: row.status,
      workspaceId: row.workspaceId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      workspaceName: row.workspaceName,
      workspaceColor: row.workspaceColor ?? "#2563EB",
    });
  } catch (error) {
    console.error("GET /api/mini-apps/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
