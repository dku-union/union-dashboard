import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { miniApps, workspaceMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { createMiniAppSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId가 필요합니다." }, { status: 400 });
  }

  try {
    // 워크스페이스 멤버인지 확인
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publisherId, session.id),
        ),
      );

    if (!membership) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const apps = await db
      .select()
      .from(miniApps)
      .where(eq(miniApps.workspaceId, workspaceId));

    return NextResponse.json(
      apps.map((app) => ({
        id: app.id,
        name: app.name,
        description: app.description,
        iconUrl: app.iconUrl,
        status: app.status,
        workspaceId: app.workspaceId,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("GET /api/mini-apps error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { workspaceId, ...rest } = body;

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId가 필요합니다." }, { status: 400 });
    }

    const parsed = createMiniAppSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
    }

    // 워크스페이스 멤버 + 권한 확인 (owner, admin, developer)
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publisherId, session.id),
        ),
      );

    if (!membership || membership.role === "viewer") {
      return NextResponse.json({ error: "앱 등록 권한이 없습니다." }, { status: 403 });
    }

    const now = new Date();
    const [app] = await db
      .insert(miniApps)
      .values({
        name: parsed.data.name,
        description: parsed.data.description || null,
        status: "PENDING",
        workspaceId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(
      {
        id: app.id,
        name: app.name,
        description: app.description,
        iconUrl: app.iconUrl,
        status: app.status,
        workspaceId: app.workspaceId,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/mini-apps error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
