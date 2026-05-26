import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

interface PublisherSendNotificationRequest {
  targetAppId: string;
  title: string;
  body: string;
  imageUrl?: string;
  category: string;
  deeplinkType?: string;
  targetPath?: string;
  targetWebUrl?: string;
  targetInternalRoute?: string;
}

interface PublisherSendNotificationResponse {
  campaignId: number;
  sentTokenCount: number;
  subscriberCount: number;
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  let body: Partial<PublisherSendNotificationRequest>;
  try {
    body = await request.json();
  } catch {
    return jsonError("요청 본문이 올바른 JSON 이 아닙니다.", 400, requestId, "BAD_REQUEST");
  }

  if (!body.targetAppId || !body.title || !body.body || !body.category) {
    return jsonError(
      "targetAppId, title, body, category 는 필수입니다.",
      400,
      requestId,
      "VALIDATION_FAILED",
    );
  }

  try {
    const result = await springFetch<PublisherSendNotificationResponse>(
      "/api/v1/publishers/me/notifications",
      session,
      { method: "POST", body },
    );

    if ("error" in result) {
      return jsonError(result.error, result.status, requestId, "SPRING_ERROR");
    }

    return jsonData(result.data, requestId);
  } catch (error) {
    return serverError("notification.test.send.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
