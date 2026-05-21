import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
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
      return NextResponse.json({ error: "알림을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/notifications/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
