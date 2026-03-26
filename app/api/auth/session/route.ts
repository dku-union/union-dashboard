import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { publishers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    const [publisher] = await db
      .select({
        publisherId: publishers.publisherId,
        email: publishers.email,
        name: publishers.name,
        role: publishers.role,
        pubstatus: publishers.pubstatus,
        createdAt: publishers.createdAt,
      })
      .from(publishers)
      .where(eq(publishers.publisherId, session.id))
      .limit(1);

    if (!publisher) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: publisher.publisherId,
        email: publisher.email,
        name: publisher.name,
        role: publisher.role,
        status: publisher.pubstatus,
        createdAt: publisher.createdAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null });
  }
}
