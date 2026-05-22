import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { workspaceInvitations, workspaceMembers, notifications, workspaces } from "@/lib/db/schema";
import { getSession, createSession } from "@/lib/auth/session";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

// POST /api/invitations/[id]?action=accept|decline
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (!action || !["accept", "decline"].includes(action)) {
    return jsonError(
      "action 파라미터가 필요합니다. (accept|decline)",
      400,
      requestId,
      "INVALID_ACTION",
    );
  }

  try {
    // 본인 이메일의 초대인지 확인
    const [invitation] = await db
      .select()
      .from(workspaceInvitations)
      .where(
        and(
          eq(workspaceInvitations.id, Number(id)),
          eq(workspaceInvitations.email, session.email),
          eq(workspaceInvitations.status, "pending"),
        ),
      )
      .limit(1);

    if (!invitation) {
      return jsonError(
        "초대를 찾을 수 없습니다.",
        404,
        requestId,
        "INVITATION_NOT_FOUND",
      );
    }

    if (action === "accept") {
      // 멤버로 추가
      await db.insert(workspaceMembers).values({
        workspaceId: invitation.workspaceId,
        publisherId: session.id,
        role: invitation.role,
      });

      // 초대 상태 업데이트
      await db
        .update(workspaceInvitations)
        .set({ status: "accepted" })
        .where(eq(workspaceInvitations.id, invitation.id));

      // 관련 알림 읽음 처리
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.publisherId, session.id),
            eq(notifications.type, "workspace_invitation"),
            eq(notifications.referenceId, String(invitation.id)),
          ),
        );

      // hasWorkspace 세션 갱신
      await createSession({
        publisherId: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        hasWorkspace: true,
      });

      // 워크스페이스 이름 조회
      const [ws] = await db
        .select({ name: workspaces.name })
        .from(workspaces)
        .where(eq(workspaces.workspaceId, invitation.workspaceId))
        .limit(1);

      return jsonData(
        {
          success: true,
          message: `"${ws?.name}" 워크스페이스에 참여했습니다.`,
        },
        requestId,
      );
    } else {
      // 거절
      await db
        .update(workspaceInvitations)
        .set({ status: "declined" })
        .where(eq(workspaceInvitations.id, invitation.id));

      // 관련 알림 읽음 처리
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.publisherId, session.id),
            eq(notifications.type, "workspace_invitation"),
            eq(notifications.referenceId, String(invitation.id)),
          ),
        );

      return jsonData(
        { success: true, message: "초대를 거절했습니다." },
        requestId,
      );
    }
  } catch (error) {
    return serverError(
      "invitation.action.failed",
      error,
      requestId,
      undefined,
      { actorId: session.id, invitationId: id, action },
    );
  }
}
