import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { publishers, workspaceMembers } from "@/lib/db/schema";
import {
  getRequestId,
  jsonData,
  serverError,
} from "@/lib/api/responses";

// 비로그인이거나 publisher row 가 사라진 경우엔 { user: null } 로 응답
// (200) — 클라이언트의 AuthProvider 가 이를 그대로 사용해 비로그인
// UX 흐름으로 진행한다.
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();

  if (!session) {
    return jsonData({ user: null }, requestId);
  }

  try {
    const [publisher] = await db
      .select({
        publisherId: publishers.publisherId,
        email: publishers.email,
        name: publishers.name,
        role: publishers.role,
        pubstatus: publishers.pubstatus,
        createdAt: publishers.createdAt,
      })
      .from(publishers)
      .where(eq(publishers.publisherId, session.id))
      .limit(1);

    if (!publisher) {
      return jsonData({ user: null }, requestId);
    }

    const memberRows = await db
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.publisherId, publisher.publisherId))
      .limit(1);

    return jsonData(
      {
        user: {
          id: publisher.publisherId,
          email: publisher.email,
          name: publisher.name,
          role: publisher.role,
          status: publisher.pubstatus,
          createdAt: publisher.createdAt?.toISOString(),
          hasWorkspace: memberRows.length > 0,
        },
      },
      requestId,
    );
  } catch (error) {
    // 세션 조회는 사일런트 fallback — 200 + null 로 응답하되 로그만 남김
    return serverError(
      "auth.session.lookup_failed",
      error,
      requestId,
      "세션 조회 중 오류가 발생했습니다.",
    );
  }
}
