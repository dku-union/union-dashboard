import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaceMembers, publishers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { inviteMemberSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id: workspaceId } = await params;

  try {
    const myRole = await getMemberRole(workspaceId, session.id);
    if (!myRole || !["owner", "admin"].includes(myRole)) {
      return NextResponse.json({ error: "멤버 추가 권한이 없습니다." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = inviteMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const { email, role } = parsed.data;

    // 등록된 퍼블리셔인지 확인
    const [publisher] = await db
      .select({ publisherId: publishers.publisherId, name: publishers.name })
      .from(publishers)
      .where(eq(publishers.email, email))
      .limit(1);

    if (!publisher) {
      return NextResponse.json(
        { error: "등록되지 않은 이메일입니다. 가입된 퍼블리셔만 초대할 수 있습니다." },
        { status: 404 },
      );
    }

    // 이미 멤버인지 확인
    const existing = await getMemberRole(workspaceId, publisher.publisherId);
    if (existing) {
      return NextResponse.json(
        { error: "이미 워크스페이스에 소속된 멤버입니다." },
        { status: 409 },
      );
    }

    const [member] = await db
      .insert(workspaceMembers)
      .values({
        workspaceId,
        publisherId: publisher.publisherId,
        role,
      })
      .returning();

    return NextResponse.json({
      id: member.id,
      publisherId: publisher.publisherId,
      name: publisher.name,
      email,
      role: member.role,
      joinedAt: member.joinedAt?.toISOString(),
    });
  } catch (error) {
    console.error("POST /api/workspaces/[id]/members error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
