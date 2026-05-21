import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.publisherId, session.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        isRead: r.isRead,
        referenceId: r.referenceId,
        createdAt: r.createdAt?.toISOString(),
      })),
    );
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
