import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { emailVerifications } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { desc } from "drizzle-orm";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const { email, code } = parsed.data;

    // 가장 최근 인증 코드 조회 (만료되지 않은 것)
    const [record] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          gt(emailVerifications.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(emailVerifications.createdAt))
      .limit(1);

    if (!record) {
      return NextResponse.json(
        { error: "인증 코드가 만료되었거나 존재하지 않습니다." },
        { status: 400 },
      );
    }

    if (record.code !== code) {
      return NextResponse.json(
        { error: "인증 코드가 일치하지 않습니다." },
        { status: 400 },
      );
    }

    // 인증 완료 처리
    await db
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.id, record.id));

    return NextResponse.json({ message: "이메일 인증이 완료되었습니다." });
  } catch (error) {
    console.error("Email verify error:", error);
    return NextResponse.json(
      { error: "인증 확인 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
