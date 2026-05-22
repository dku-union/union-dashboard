import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { workspaceMembers, workspaceInvitations, notifications, publishers, workspaces } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { inviteMemberSchema } from "@/lib/validations";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

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
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id: workspaceId } = await params;

  try {
    const myRole = await getMemberRole(workspaceId, session.id);
    if (!myRole || !["owner", "admin"].includes(myRole)) {
      return jsonError("멤버 추가 권한이 없습니다.", 403, requestId, "MEMBER_INVITE_DENIED");
    }

    const body = await request.json();
    const parsed = inviteMemberSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("입력값이 올바르지 않습니다.", 400, requestId, "INVALID_INPUT");
    }

    const { email, role } = parsed.data;

    // 이미 멤버인지 확인 (가입된 경우)
    const [publisher] = await db
      .select({ publisherId: publishers.publisherId })
      .from(publishers)
      .where(eq(publishers.email, email))
      .limit(1);

    if (publisher) {
      const existing = await getMemberRole(workspaceId, publisher.publisherId);
      if (existing) {
        return jsonError(
          "이미 워크스페이스에 소속된 멤버입니다.",
          409,
          requestId,
          "MEMBER_ALREADY_EXISTS",
        );
      }
    }

    // 이미 대기 중인 초대가 있는지 확인
    const [existingInvite] = await db
      .select()
      .from(workspaceInvitations)
      .where(
        and(
          eq(workspaceInvitations.workspaceId, workspaceId),
          eq(workspaceInvitations.email, email),
          eq(workspaceInvitations.status, "pending"),
        ),
      )
      .limit(1);

    if (existingInvite) {
      return jsonError(
        "이미 초대가 발송된 이메일입니다.",
        409,
        requestId,
        "INVITATION_ALREADY_PENDING",
      );
    }

    // 워크스페이스 이름 조회
    const [ws] = await db
      .select({ name: workspaces.name })
      .from(workspaces)
      .where(eq(workspaces.workspaceId, workspaceId))
      .limit(1);

    // 초대 생성
    const [invitation] = await db
      .insert(workspaceInvitations)
      .values({
        workspaceId,
        email,
        role,
        invitedBy: session.id,
      })
      .returning();

    // 가입된 퍼블리셔라면 알림도 생성
    if (publisher) {
      await db.insert(notifications).values({
        publisherId: publisher.publisherId,
        type: "workspace_invitation",
        title: "워크스페이스 초대",
        message: `${session.name}님이 "${ws?.name}" 워크스페이스에 ${role}(으)로 초대했습니다.`,
        referenceId: String(invitation.id),
      });
    }

    return jsonData(
      {
        id: invitation.id,
        email,
        role: invitation.role,
        status: invitation.status,
        createdAt: invitation.createdAt?.toISOString(),
        isRegistered: !!publisher,
      },
      requestId,
    );
  } catch (error) {
    return serverError("workspace.invite.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId,
    });
  }
}
