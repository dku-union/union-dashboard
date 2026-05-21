import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { emailVerifications } from "@/lib/db/schema";
import { sendVerificationEmail } from "@/lib/mail/send";
import { eq, and, gt } from "drizzle-orm";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "유효한 이메일을 입력해주세요." },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    // 최근 1분 내 발송 이력이 있으면 차단 (스팸 방지)
    const recent = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          gt(emailVerifications.createdAt, new Date(Date.now() - 60_000)),
        ),
      )
      .limit(1);

    if (recent.length > 0) {
      return NextResponse.json(
        { error: "1분 후에 다시 시도해주세요." },
        { status: 429 },
      );
    }

    const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
    const expiresAt = new Date(Date.now() + 5 * 60_000); // 5분

    await db.insert(emailVerifications).values({ email, code, expiresAt });
    await sendVerificationEmail(email, code);

    return NextResponse.json({ message: "인증 코드가 발송되었습니다." });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "인증 코드 발송에 실패했습니다." },
      { status: 500 },
    );
  }
}
