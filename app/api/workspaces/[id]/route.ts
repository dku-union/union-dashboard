import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers, publishers, workspaceInvitations } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

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
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;

  try {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.workspaceId, id))
      .limit(1);

    if (!workspace) {
      return jsonError(
        "워크스페이스를 찾을 수 없습니다.",
        404,
        requestId,
        "WORKSPACE_NOT_FOUND",
      );
    }

    const myRole = await getMemberRole(id, session.id);
    if (!myRole) {
      return jsonError(
        "접근 권한이 없습니다.",
        403,
        requestId,
        "WORKSPACE_ACCESS_DENIED",
      );
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

    return jsonData(
      {
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
      },
      requestId,
    );
  } catch (error) {
    return serverError("workspace.get.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId: id,
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;

  try {
    const myRole = await getMemberRole(id, session.id);
    if (!myRole || !["owner", "admin"].includes(myRole)) {
      return jsonError("수정 권한이 없습니다.", 403, requestId, "WORKSPACE_WRITE_DENIED");
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("입력값이 올바르지 않습니다.", 400, requestId, "INVALID_INPUT");
    }

    const [updated] = await db
      .update(workspaces)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(workspaces.workspaceId, id))
      .returning();

    return jsonData(
      {
        id: updated.workspaceId,
        name: updated.name,
        description: updated.description,
        contactEmail: updated.contactEmail,
        color: updated.color,
        ownerId: updated.ownerId,
        createdAt: updated.createdAt?.toISOString(),
        updatedAt: updated.updatedAt?.toISOString(),
      },
      requestId,
    );
  } catch (error) {
    return serverError("workspace.patch.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId: id,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;

  try {
    const myRole = await getMemberRole(id, session.id);
    if (myRole !== "owner") {
      return jsonError(
        "소유자만 삭제할 수 있습니다.",
        403,
        requestId,
        "OWNER_ONLY",
      );
    }

    await db.delete(workspaces).where(eq(workspaces.workspaceId, id));

    return jsonData({ success: true }, requestId);
  } catch (error) {
    return serverError("workspace.delete.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId: id,
    });
  }
}
