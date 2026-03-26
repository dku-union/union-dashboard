import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { publishers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const [publisher] = await db
      .select()
      .from(publishers)
      .where(eq(publishers.email, email))
      .limit(1);

    if (!publisher) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, publisher.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    if (publisher.pubstatus === "SUSPENDED") {
      return NextResponse.json(
        { error: "정지된 계정입니다. 관리자에게 문의하세요." },
        { status: 403 },
      );
    }

    await createSession(publisher);

    return NextResponse.json({
      id: publisher.publisherId,
      email: publisher.email,
      name: publisher.name,
      role: publisher.role,
      status: publisher.pubstatus,
      createdAt: publisher.createdAt?.toISOString(),
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
