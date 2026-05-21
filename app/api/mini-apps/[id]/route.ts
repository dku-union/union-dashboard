import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { miniApps, workspaceMembers, workspaces } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { canWriteAppVersion, getMiniAppMembership } from "@/lib/app-versions/access";
import {
  getRequestId,
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

// NOTE: Spring 측 PATCH /mini-apps/{id} (이름/설명 수정) endpoint 가 아직 없음.
// endpoint 추가되면 아래 stub 의 503 분기를 제거하고 springFetch 로 forward 하면
// 됨. 권한 검증과 dashboard DB 동기화 코드는 미리 작성해둠.
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

    // Spring endpoint 미구현. 활성화 시점에 아래 분기를 제거하고
    // springFetch("/mini-apps/${miniAppId}", session, { method: "PATCH", body: parsed.data })
    // 호출 후 dashboard DB (miniApps 테이블) 동기화하는 흐름으로 교체.
    logger.warn("mini_app.patch.not_implemented", {
      requestId,
      actorId: session.id,
      miniAppId,
    });
    return jsonError(
      "앱 정보 수정 API는 아직 백엔드 구현 대기 중입니다.",
      503,
      requestId,
      "NOT_IMPLEMENTED",
    );
  } catch (error) {
    return serverError("mini_app.patch.failed", error, requestId, undefined, {
      actorId: session.id,
      miniAppId,
    });
  }
}

