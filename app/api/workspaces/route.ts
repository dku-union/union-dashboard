import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/lib/db/schema";
import { getSession, createSession } from "@/lib/auth/session";
import { createWorkspaceSchema } from "@/lib/validations";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
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

    return jsonData(result, requestId);
  } catch (error) {
    return serverError("workspace.list.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const body = await request.json();
    const parsed = createWorkspaceSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(
        "입력값이 올바르지 않습니다.",
        400,
        requestId,
        "INVALID_INPUT",
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
      },
      requestId,
    );
  } catch (error) {
    return serverError("workspace.create.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
