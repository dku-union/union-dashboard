import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request);
  const session = await getSession();
  if (!session) {
    return jsonError("인증이 필요합니다.", 401, requestId, "UNAUTHENTICATED");
  }

  const { id } = await params;

  try {
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, Number(id)),
          eq(notifications.publisherId, session.id),
        ),
      )
      .returning();

    if (!updated) {
      return jsonError("알림을 찾을 수 없습니다.", 404, requestId, "NOTIFICATION_NOT_FOUND");
    }

    return jsonData({ success: true }, requestId);
  } catch (error) {
    return serverError("notification.read.failed", error, requestId, undefined, {
      actorId: session.id,
      notificationId: id,
    });
  }
}
