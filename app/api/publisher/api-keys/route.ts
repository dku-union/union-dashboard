import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

interface ApiKeyResponse {
  id: number;
  keyPrefix: string;
  name: string;
  scopes: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

interface IssueApiKeyResponse extends ApiKeyResponse {
  rawKey: string;
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const result = await springFetch<ApiKeyResponse[]>(
      "/api/v1/publishers/me/api-keys",
      session,
    );

    if ("error" in result) {
      return jsonError(result.error, result.status, requestId, "SPRING_ERROR");
    }

    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("apikey.list.failed", error, requestId, undefined, {
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

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("요청 본문이 올바른 JSON 이 아닙니다.", 400, requestId, "BAD_REQUEST");
  }

  const name = body.name?.trim();
  if (!name) {
    return jsonError("키 이름을 입력해주세요.", 400, requestId, "VALIDATION_FAILED");
  }

  try {
    const result = await springFetch<IssueApiKeyResponse>(
      "/api/v1/publishers/me/api-keys",
      session,
      { method: "POST", body: { name } },
    );

    if ("error" in result) {
      return jsonError(result.error, result.status, requestId, "SPRING_ERROR");
    }

    return jsonData(result.data, requestId, 201);
  } catch (error) {
    return serverError("apikey.issue.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
