import { z } from "zod";
import { eq, and, gt, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { emailVerifications } from "@/lib/db/schema";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return jsonError(
        "입력값이 올바르지 않습니다.",
        400,
        requestId,
        "INVALID_INPUT",
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
      return jsonError(
        "인증 코드가 만료되었거나 존재하지 않습니다.",
        400,
        requestId,
        "CODE_EXPIRED_OR_MISSING",
      );
    }

    if (record.code !== code) {
      return jsonError(
        "인증 코드가 일치하지 않습니다.",
        400,
        requestId,
        "CODE_MISMATCH",
      );
    }

    // 인증 완료 처리
    await db
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.id, record.id));

    return jsonData({ message: "이메일 인증이 완료되었습니다." }, requestId);
  } catch (error) {
    return serverError(
      "auth.email.verify.failed",
      error,
      requestId,
      "인증 확인 중 오류가 발생했습니다.",
    );
  }
}
