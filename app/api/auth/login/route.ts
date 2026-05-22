import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { publishers, workspaceMembers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import {
  getRequestId,
  jsonData,
  jsonError,
  serverError,
} from "@/lib/api/responses";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("입력값이 올바르지 않습니다.", 400, requestId, "INVALID_INPUT");
    }

    const { email, password } = parsed.data;

    const [publisher] = await db
      .select()
      .from(publishers)
      .where(eq(publishers.email, email))
      .limit(1);

    if (!publisher) {
      return jsonError(
        "이메일 또는 비밀번호가 올바르지 않습니다.",
        401,
        requestId,
        "INVALID_CREDENTIALS",
      );
    }

    const isValid = await verifyPassword(password, publisher.password);
    if (!isValid) {
      return jsonError(
        "이메일 또는 비밀번호가 올바르지 않습니다.",
        401,
        requestId,
        "INVALID_CREDENTIALS",
      );
    }

    if (publisher.pubstatus === "SUSPENDED") {
      return jsonError(
        "정지된 계정입니다. 관리자에게 문의하세요.",
        403,
        requestId,
        "ACCOUNT_SUSPENDED",
      );
    }

    const memberRows = await db
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.publisherId, publisher.publisherId))
      .limit(1);
    const hasWorkspace = memberRows.length > 0;

    await createSession({ ...publisher, hasWorkspace });

    return jsonData(
      {
        id: publisher.publisherId,
        email: publisher.email,
        name: publisher.name,
        role: publisher.role,
        status: publisher.pubstatus,
        createdAt: publisher.createdAt?.toISOString(),
        hasWorkspace,
      },
      requestId,
    );
  } catch (error) {
    return serverError("auth.login.failed", error, requestId, "로그인 중 오류가 발생했습니다.");
  }
}
