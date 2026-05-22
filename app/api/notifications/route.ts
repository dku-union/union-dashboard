import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  try {
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.publisherId, session.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return jsonData(
      rows.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        isRead: r.isRead,
        referenceId: r.referenceId,
        createdAt: r.createdAt?.toISOString(),
      })),
      requestId,
    );
  } catch (error) {
    return serverError("notification.list.failed", error, requestId, undefined, {
      actorId: session.id,
    });
  }
}
