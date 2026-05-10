import { jsonError } from "@/lib/api/responses";
import { logger } from "@/lib/observability/logger";

export function requireSameOrigin(request: Request, requestId: string) {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const expectedOrigin = new URL(request.url).origin;
  if (origin === expectedOrigin) return null;

  logger.warn("security.origin_mismatch", {
    requestId,
    origin,
    expectedOrigin,
    path: new URL(request.url).pathname,
  });

  return jsonError("요청 출처가 올바르지 않습니다.", 403, requestId, "ORIGIN_MISMATCH");
}
