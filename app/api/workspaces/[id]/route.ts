import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers, publishers, workspaceInvitations } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  contactEmail: z.string().email().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

async function getMemberRole(workspaceId: string, publisherId: string) {
  const [member] = await db
    .select({ role: workspaceMembers.role })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.publisherId, publisherId),
      ),
    )
    .limit(1);
  return member?.role ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.workspaceId, id))
      .limit(1);

    if (!workspace) {
      return NextResponse.json({ error: "워크스페이스를 찾을 수 없습니다." }, { status: 404 });
    }

    const myRole = await getMemberRole(id, session.id);
    if (!myRole) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }

    const members = await db
      .select({
        id: workspaceMembers.id,
        publisherId: workspaceMembers.publisherId,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
        name: publishers.name,
        email: publishers.email,
      })
      .from(workspaceMembers)
      .innerJoin(publishers, eq(workspaceMembers.publisherId, publishers.publisherId))
      .where(eq(workspaceMembers.workspaceId, id));

    // pending 초대 조회
    const pendingInvites = await db
      .select({
        id: workspaceInvitations.id,
        email: workspaceInvitations.email,
        role: workspaceInvitations.role,
        createdAt: workspaceInvitations.createdAt,
      })
      .from(workspaceInvitations)
      .where(
        and(
          eq(workspaceInvitations.workspaceId, id),
          eq(workspaceInvitations.status, "pending"),
        ),
      );

    return NextResponse.json({
      id: workspace.workspaceId,
      name: workspace.name,
      description: workspace.description,
      contactEmail: workspace.contactEmail,
      color: workspace.color,
      ownerId: workspace.ownerId,
      createdAt: workspace.createdAt?.toISOString(),
      updatedAt: workspace.updatedAt?.toISOString(),
      myRole,
      members: members.map((m) => ({
        id: m.id,
        publisherId: m.publisherId,
        name: m.name,
        email: m.email,
        role: m.role,
        joinedAt: m.joinedAt?.toISOString(),
      })),
      pendingInvitations: pendingInvites.map((inv) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        createdAt: inv.createdAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/workspaces/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const myRole = await getMemberRole(id, session.id);
    if (!myRole || !["owner", "admin"].includes(myRole)) {
      return NextResponse.json({ error: "수정 권한이 없습니다." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(workspaces)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(workspaces.workspaceId, id))
      .returning();

    return NextResponse.json({
      id: updated.workspaceId,
      name: updated.name,
      description: updated.description,
      contactEmail: updated.contactEmail,
      color: updated.color,
      ownerId: updated.ownerId,
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    });
  } catch (error) {
    console.error("PATCH /api/workspaces/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const myRole = await getMemberRole(id, session.id);
    if (myRole !== "owner") {
      return NextResponse.json({ error: "소유자만 삭제할 수 있습니다." }, { status: 403 });
    }

    await db.delete(workspaces).where(eq(workspaces.workspaceId, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/workspaces/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
