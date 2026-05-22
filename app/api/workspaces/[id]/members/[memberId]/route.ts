import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { workspaceMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

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
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id: workspaceId, memberId } = await params;

  try {
    const myRole = await getMemberRole(workspaceId, session.id);
    if (myRole !== "owner") {
      return jsonError(
        "소유자만 역할을 변경할 수 있습니다.",
        403,
        requestId,
        "OWNER_ONLY",
      );
    }

    const body = await request.json();
    const parsed = updateRoleSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("입력값이 올바르지 않습니다.", 400, requestId, "INVALID_INPUT");
    }

    // owner 역할은 변경 불가
    const [target] = await db
      .select({ role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.id, Number(memberId)),
          eq(workspaceMembers.workspaceId, workspaceId),
        ),
      )
      .limit(1);

    if (!target) {
      return jsonError("멤버를 찾을 수 없습니다.", 404, requestId, "MEMBER_NOT_FOUND");
    }

    if (target.role === "owner") {
      return jsonError(
        "소유자의 역할은 변경할 수 없습니다.",
        400,
        requestId,
        "OWNER_ROLE_IMMUTABLE",
      );
    }

    const [updated] = await db
      .update(workspaceMembers)
      .set({ role: parsed.data.role })
      .where(
        and(
          eq(workspaceMembers.id, Number(memberId)),
          eq(workspaceMembers.workspaceId, workspaceId),
        ),
      )
      .returning();

    return jsonData({ id: updated.id, role: updated.role }, requestId);
  } catch (error) {
    return serverError("workspace.member.patch.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId,
      memberId,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> },
) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id: workspaceId, memberId } = await params;

  try {
    const myRole = await getMemberRole(workspaceId, session.id);
    if (!myRole || !["owner", "admin"].includes(myRole)) {
      return jsonError(
        "멤버 제거 권한이 없습니다.",
        403,
        requestId,
        "MEMBER_REMOVE_DENIED",
      );
    }

    const [target] = await db
      .select({ role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.id, Number(memberId)),
          eq(workspaceMembers.workspaceId, workspaceId),
        ),
      )
      .limit(1);

    if (!target) {
      return jsonError("멤버를 찾을 수 없습니다.", 404, requestId, "MEMBER_NOT_FOUND");
    }

    if (target.role === "owner") {
      return jsonError(
        "소유자는 제거할 수 없습니다.",
        400,
        requestId,
        "OWNER_REMOVAL_FORBIDDEN",
      );
    }

    await db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.id, Number(memberId)),
          eq(workspaceMembers.workspaceId, workspaceId),
        ),
      );

    return jsonData({ success: true }, requestId);
  } catch (error) {
    return serverError("workspace.member.delete.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId,
      memberId,
    });
  }
}
