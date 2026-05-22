import { z } from "zod";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { emailVerifications } from "@/lib/db/schema";
import { sendVerificationEmail } from "@/lib/mail/send";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return jsonError(
        "유효한 이메일을 입력해주세요.",
        400,
        requestId,
        "INVALID_INPUT",
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
      return jsonError(
        "1분 후에 다시 시도해주세요.",
        429,
        requestId,
        "RATE_LIMITED",
      );
    }

    const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
    const expiresAt = new Date(Date.now() + 5 * 60_000); // 5분

    await db.insert(emailVerifications).values({ email, code, expiresAt });
    await sendVerificationEmail(email, code);

    return jsonData({ message: "인증 코드가 발송되었습니다." }, requestId);
  } catch (error) {
    return serverError(
      "auth.email.send.failed",
      error,
      requestId,
      "인증 코드 발송에 실패했습니다.",
    );
  }
}
