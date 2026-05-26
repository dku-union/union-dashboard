import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import { appIdSchema } from "@/lib/validations";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

// Dashboard 등록 폼의 실시간 appId 중복 체크. Spring 으로 forward.
// race condition 은 등록 시 unique 제약이 최종 보루.
export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");

  const parsed = appIdSchema.safeParse(appId);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "appId 형식이 올바르지 않습니다.",
      400,
      requestId,
      "INVALID_APP_ID",
    );
  }

  try {
    const springResult = await springFetch<{ available: boolean }>(
      `/mini-apps/check-app-id?appId=${encodeURIComponent(parsed.data)}`,
      session,
    );

    if ("error" in springResult) {
      return jsonError(
        springResult.error,
        springResult.status,
        requestId,
        "SPRING_REQUEST_FAILED",
      );
    }

    return jsonData({ available: springResult.data.available }, requestId);
  } catch (error) {
    return serverError(
      "mini_app.check_app_id.failed",
      error,
      requestId,
      undefined,
      { actorId: session.id, appId: parsed.data },
    );
  }
}
