import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { publishers, emailVerifications } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { eq, and, desc } from "drizzle-orm";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    // 이메일 인증 완료 여부 확인
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.verified, true),
        ),
      )
      .orderBy(desc(emailVerifications.createdAt))
      .limit(1);

    if (!verification) {
      return NextResponse.json(
        { error: "이메일 인증을 먼저 완료해주세요." },
        { status: 400 },
      );
    }

    // Check duplicate email
    const existing = await db
      .select({ publisherId: publishers.publisherId })
      .from(publishers)
      .where(eq(publishers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const [newPublisher] = await db
      .insert(publishers)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "ROLE_USER",
        pubstatus: "ACTIVE",
      })
      .returning();

    await createSession({ ...newPublisher, hasWorkspace: false });

    return NextResponse.json({
      id: newPublisher.publisherId,
      email: newPublisher.email,
      name: newPublisher.name,
      role: newPublisher.role,
      status: newPublisher.pubstatus,
      hasWorkspace: false,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
