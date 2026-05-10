import { NextResponse } from "next/server";
import { logger } from "@/lib/observability/logger";

export function getRequestId(request: Request) {
  return request.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function jsonError(
  message: string,
  status: number,
  requestId: string,
  code?: string,
) {
  return NextResponse.json(
    { error: message, code, requestId },
    {
      status,
      headers: {
        "x-request-id": requestId,
      },
    },
  );
}

export function jsonData<T>(data: T, requestId: string, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "x-request-id": requestId,
    },
  });
}

export function serverError(
  event: string,
  error: unknown,
  requestId: string,
  message = "서버 오류가 발생했습니다.",
  fields?: Record<string, unknown>,
) {
  logger.error(event, error, { requestId, ...fields });
  return jsonError(message, 500, requestId, "INTERNAL_SERVER_ERROR");
}
