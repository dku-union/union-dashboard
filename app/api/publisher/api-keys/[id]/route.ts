import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

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
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return jsonError("올바른 키 ID 가 아닙니다.", 400, requestId, "BAD_REQUEST");
  }

  try {
    const result = await springFetch(
      `/api/v1/publishers/me/api-keys/${numericId}`,
      session,
      { method: "DELETE" },
    );

    if ("error" in result) {
      return jsonError(result.error, result.status, requestId, "SPRING_ERROR");
    }

    return jsonData({ ok: true }, requestId);
  } catch (error) {
    return serverError("apikey.revoke.failed", error, requestId, undefined, {
      actorId: session.id,
      keyId: numericId,
    });
  }
}
