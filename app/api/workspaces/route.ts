import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers, publishers } from "@/lib/db/schema";
import { getSession, createSession } from "@/lib/auth/session";
import { createWorkspaceSchema } from "@/lib/validations";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const rows = await db
      .select({
        workspaceId: workspaces.workspaceId,
        name: workspaces.name,
        description: workspaces.description,
        contactEmail: workspaces.contactEmail,
        color: workspaces.color,
        ownerId: workspaces.ownerId,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
        myRole: workspaceMembers.role,
        memberCount: sql<number>`(
          select count(*) from workspace_members wm
          where wm.workspace_id = ${workspaces.workspaceId}
        )`.as("member_count"),
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.workspaceId))
      .where(eq(workspaceMembers.publisherId, session.id));

    const result = rows.map((r) => ({
      id: r.workspaceId,
      name: r.name,
      description: r.description,
      contactEmail: r.contactEmail,
      color: r.color,
      ownerId: r.ownerId,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
      myRole: r.myRole,
      memberCount: Number(r.memberCount),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/workspaces error:", error);
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
    const parsed = createWorkspaceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const { name, description, contactEmail, color } = parsed.data;

    const [workspace] = await db
      .insert(workspaces)
      .values({
        name,
        description: description || null,
        contactEmail,
        color: color || "#2563EB",
        ownerId: session.id,
      })
      .returning();

    await db.insert(workspaceMembers).values({
      workspaceId: workspace.workspaceId,
      publisherId: session.id,
      role: "owner",
    });

    // 세션 갱신: hasWorkspace를 true로
    await createSession({
      publisherId: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
      hasWorkspace: true,
    });

    return NextResponse.json({
      id: workspace.workspaceId,
      name: workspace.name,
      description: workspace.description,
      contactEmail: workspace.contactEmail,
      color: workspace.color,
      ownerId: workspace.ownerId,
      createdAt: workspace.createdAt?.toISOString(),
      updatedAt: workspace.updatedAt?.toISOString(),
    });
  } catch (error) {
    console.error("POST /api/workspaces error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
