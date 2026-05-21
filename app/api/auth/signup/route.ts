import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { publishers, emailVerifications, workspaceInvitations, notifications, workspaces } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { eq, and, desc } from "drizzle-orm";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    // 이메일 인증 완료 여부 확인
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.verified, true),
        ),
      )
      .orderBy(desc(emailVerifications.createdAt))
      .limit(1);

    if (!verification) {
      return NextResponse.json(
        { error: "이메일 인증을 먼저 완료해주세요." },
        { status: 400 },
      );
    }

    // Check duplicate email
    const existing = await db
      .select({ publisherId: publishers.publisherId })
      .from(publishers)
      .where(eq(publishers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const [newPublisher] = await db
      .insert(publishers)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "ROLE_USER",
        pubstatus: "ACTIVE",
      })
      .returning();

    // 가입 전 받은 pending 초대가 있으면 알림 생성
    const pendingInvites = await db
      .select({
        id: workspaceInvitations.id,
        workspaceId: workspaceInvitations.workspaceId,
        role: workspaceInvitations.role,
        invitedBy: workspaceInvitations.invitedBy,
      })
      .from(workspaceInvitations)
      .where(
        and(
          eq(workspaceInvitations.email, email),
          eq(workspaceInvitations.status, "pending"),
        ),
      );

    if (pendingInvites.length > 0) {
      // 초대한 워크스페이스 이름 + 초대자 이름 조회
      for (const inv of pendingInvites) {
        const [ws] = await db
          .select({ name: workspaces.name })
          .from(workspaces)
          .where(eq(workspaces.workspaceId, inv.workspaceId))
          .limit(1);
        const [inviter] = await db
          .select({ name: publishers.name })
          .from(publishers)
          .where(eq(publishers.publisherId, inv.invitedBy))
          .limit(1);

        await db.insert(notifications).values({
          publisherId: newPublisher.publisherId,
          type: "workspace_invitation",
          title: "워크스페이스 초대",
          message: `${inviter?.name ?? "알 수 없음"}님이 "${ws?.name}" 워크스페이스에 초대했습니다.`,
          referenceId: String(inv.id),
        });
      }
    }

    await createSession({ ...newPublisher, hasWorkspace: false });

    return NextResponse.json({
      id: newPublisher.publisherId,
      email: newPublisher.email,
      name: newPublisher.name,
      role: newPublisher.role,
      status: newPublisher.pubstatus,
      hasWorkspace: false,
      pendingInvitations: pendingInvites.length,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
