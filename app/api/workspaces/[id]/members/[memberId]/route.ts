import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaceMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["admin", "developer", "viewer"]),
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id: workspaceId, memberId } = await params;

  try {
    const myRole = await getMemberRole(workspaceId, session.id);
    if (myRole !== "owner") {
      return NextResponse.json({ error: "소유자만 역할을 변경할 수 있습니다." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateRoleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    // owner 역할은 변경 불가
    const [target] = await db
      .select({ role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.id, Number(memberId)))
      .limit(1);

    if (!target) {
      return NextResponse.json({ error: "멤버를 찾을 수 없습니다." }, { status: 404 });
    }

    if (target.role === "owner") {
      return NextResponse.json({ error: "소유자의 역할은 변경할 수 없습니다." }, { status: 400 });
    }

    const [updated] = await db
      .update(workspaceMembers)
      .set({ role: parsed.data.role })
      .where(eq(workspaceMembers.id, Number(memberId)))
      .returning();

    return NextResponse.json({
      id: updated.id,
      role: updated.role,
    });
  } catch (error) {
    console.error("PATCH /api/workspaces/[id]/members/[memberId] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id: workspaceId, memberId } = await params;

  try {
    const myRole = await getMemberRole(workspaceId, session.id);
    if (!myRole || !["owner", "admin"].includes(myRole)) {
      return NextResponse.json({ error: "멤버 제거 권한이 없습니다." }, { status: 403 });
    }

    const [target] = await db
      .select({ role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.id, Number(memberId)))
      .limit(1);

    if (!target) {
      return NextResponse.json({ error: "멤버를 찾을 수 없습니다." }, { status: 404 });
    }

    if (target.role === "owner") {
      return NextResponse.json({ error: "소유자는 제거할 수 없습니다." }, { status: 400 });
    }

    await db
      .delete(workspaceMembers)
      .where(eq(workspaceMembers.id, Number(memberId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/workspaces/[id]/members/[memberId] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
