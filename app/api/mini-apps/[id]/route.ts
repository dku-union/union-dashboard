import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { miniApps, workspaceMembers, workspaces } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { canWriteAppVersion, getMiniAppMembership } from "@/lib/app-versions/access";
import { springFetch } from "@/lib/spring/client";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const miniAppId = Number(id);
  if (Number.isNaN(miniAppId)) {
    return NextResponse.json({ error: "유효하지 않은 ID입니다." }, { status: 400 });
  }

  try {
    const [row] = await db
      .select({
        id: miniApps.id,
        name: miniApps.name,
        description: miniApps.description,
        iconUrl: miniApps.iconUrl,
        status: miniApps.status,
        workspaceId: miniApps.workspaceId,
        createdAt: miniApps.createdAt,
        updatedAt: miniApps.updatedAt,
        workspaceName: workspaces.name,
        workspaceColor: workspaces.color,
      })
      .from(miniApps)
      .innerJoin(workspaces, eq(miniApps.workspaceId, workspaces.workspaceId))
      .where(eq(miniApps.id, miniAppId));

    if (!row) {
      return NextResponse.json({ error: "앱을 찾을 수 없습니다." }, { status: 404 });
    }

    // 접근 권한 확인
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, row.workspaceId),
          eq(workspaceMembers.publisherId, session.id),
        ),
      );

    if (!membership) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    return NextResponse.json({
      id: row.id,
      name: row.name,
      description: row.description,
      iconUrl: row.iconUrl,
      status: row.status,
      workspaceId: row.workspaceId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      workspaceName: row.workspaceName,
      workspaceColor: row.workspaceColor ?? "#2563EB",
    });
  } catch (error) {
    console.error("GET /api/mini-apps/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

const patchSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(2000).nullable().optional(),
});

// Spring 의 MiniAppResponseDto 와 매핑되는 응답 형태. 신규 필드(tags, permissions)는
// 응답에 포함되지만 dashboard 측 GET 라우트가 별도라 그대로 forward 해두고,
// 클라이언트(useMiniAppDetail 등) 가 필요 시 활용.
interface MiniAppPatchResponse {
  id: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
  workspaceName?: string;
  status: string;
  tags?: string | null;
  permissions?: string[] | null;
  createdAt: string;
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const originError = requireSameOrigin(request, requestId);
  if (originError) return originError;

  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;
  const miniAppId = Number(id);
  if (!Number.isInteger(miniAppId) || miniAppId <= 0) {
    return jsonError("유효하지 않은 ID입니다.", 400, requestId, "INVALID_ID");
  }

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("입력값이 올바르지 않습니다.", 400, requestId, "INVALID_INPUT");
    }

    const membership = await getMiniAppMembership(miniAppId, session.id);
    if (!membership) {
      return jsonError("앱 접근 권한이 없습니다.", 403, requestId, "APP_ACCESS_DENIED");
    }
    if (!canWriteAppVersion(membership.role)) {
      return jsonError("앱 정보 수정 권한이 없습니다.", 403, requestId, "APP_WRITE_DENIED");
    }

    const result = await springFetch<MiniAppPatchResponse>(
      `/mini-apps/${miniAppId}`,
      session,
      { method: "PATCH", body: parsed.data },
    );

    if ("error" in result) {
      logger.warn("mini_app.patch.spring_failed", {
        requestId,
        actorId: session.id,
        miniAppId,
        status: result.status,
      });
      return jsonError(result.error, result.status, requestId, "SPRING_REQUEST_FAILED");
    }

    // dashboard DB(drizzle) 동기화: name / description 만 부분 업데이트.
    // (Spring 응답 전체를 신뢰하되, dashboard 테이블엔 해당 두 필드만 미러링)
    const updates: { name?: string; description?: string | null; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    await db.update(miniApps).set(updates).where(eq(miniApps.id, miniAppId));

    logger.info("mini_app.patch.succeeded", {
      requestId,
      actorId: session.id,
      miniAppId,
    });

    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("mini_app.patch.failed", error, requestId, undefined, {
      actorId: session.id,
      miniAppId,
    });
  }
}

