import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { miniApps, workspaceMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import { createMiniAppSchema } from "@/lib/validations";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";
import { requireSameOrigin } from "@/lib/api/security";
import { logger } from "@/lib/observability/logger";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) {
    return jsonError(
      "workspaceId가 필요합니다.",
      400,
      requestId,
      "MISSING_WORKSPACE_ID",
    );
  }

  try {
    // 워크스페이스 멤버인지 확인
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publisherId, session.id),
        ),
      );

    if (!membership) {
      return jsonError("권한이 없습니다.", 403, requestId, "WORKSPACE_ACCESS_DENIED");
    }

    const apps = await db
      .select()
      .from(miniApps)
      .where(eq(miniApps.workspaceId, workspaceId));

    return jsonData(
      apps.map((app) => ({
        id: app.id,
        name: app.name,
        description: app.description,
        iconUrl: app.iconUrl,
        status: app.status,
        workspaceId: app.workspaceId,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
      })),
      requestId,
    );
  } catch (error) {
    return serverError("mini_app.list.failed", error, requestId, undefined, {
      actorId: session.id,
      workspaceId,
    });
  }
}

// Spring 응답 (MiniAppResponseDto) — 신규 필드 tags/permissions 포함
interface SpringMiniAppResponse {
  id: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
  workspaceName: string;
  status: "PENDING" | "APPROVED";
  tags: string | null;
  permissions: string[] | null;
  createdAt: string;
}

// 등록은 Spring 이 source of truth — Spring POST /mini-apps 호출 후
// 응답 받은 row 를 dashboard miniApps 테이블에 동일 id 로 미러링.
export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const originError = requireSameOrigin(request, requestId);
  if (originError) return originError;

  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const body = await request.json();
    const { workspaceId, ...rest } = body;

    if (!workspaceId || typeof workspaceId !== "string") {
      return jsonError(
        "workspaceId가 필요합니다.",
        400,
        requestId,
        "MISSING_WORKSPACE_ID",
      );
    }

    const parsed = createMiniAppSchema.safeParse(rest);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
        400,
        requestId,
        "INVALID_INPUT",
      );
    }

    // dashboard 측 1차 권한 검증 (viewer 제외) — Spring 도 멤버십 검증함
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publisherId, session.id),
        ),
      );

    if (!membership || membership.role === "viewer") {
      return jsonError(
        "앱 등록 권한이 없습니다.",
        403,
        requestId,
        "REGISTER_DENIED",
      );
    }

    // Spring 으로 forward — Spring 에서 카테고리 존재 검증 + 권한 검증 + 저장
    const springBody = {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      iconUrl: null, // 등록 직후 별도 업로드 흐름 (백엔드 optional 처리)
      workspaceId,
      categoryId: parsed.data.categoryId,
      appId: parsed.data.appId,
      keywords: parsed.data.keywords ?? [],
      permissions: parsed.data.permissions ?? [],
    };

    const springResult = await springFetch<SpringMiniAppResponse>(
      "/mini-apps",
      session,
      { method: "POST", body: springBody },
    );

    if ("error" in springResult) {
      logger.warn("mini_app.register.spring_failed", {
        requestId,
        actorId: session.id,
        workspaceId,
        status: springResult.status,
      });
      return jsonError(
        springResult.error,
        springResult.status,
        requestId,
        "SPRING_REQUEST_FAILED",
      );
    }

    const created = springResult.data;

    // dashboard 와 Spring 은 동일한 Neon DB 의 mini_apps 테이블을 공유하므로
    // Spring 이 이미 insert 한 row 를 다시 insert 하면 PK 충돌이 발생함.
    // dashboard 측 별도 insert 는 제거하고, Spring 응답을 그대로 forward 한다.
    // (createdAt/updatedAt 도 Spring 측 @PrePersist 가 채운 값 사용)

    logger.info("mini_app.register.succeeded", {
      requestId,
      actorId: session.id,
      workspaceId,
      miniAppId: created.id,
    });

    return jsonData(
      {
        id: created.id,
        name: created.name,
        description: created.description,
        iconUrl: created.iconUrl,
        status: created.status,
        workspaceId,
        tags: created.tags,
        permissions: created.permissions,
        createdAt: created.createdAt,
      },
      requestId,
      201,
    );
  } catch (error) {
    return serverError("mini_app.register.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
