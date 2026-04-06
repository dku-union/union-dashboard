import { getSession } from "@/lib/auth/session";

export async function requireAdminSession() {
  const session = await getSession();

  if (!session) {
    return { error: "인증이 필요합니다.", status: 401 as const };
  }

  if (session.role !== "ROLE_ADMIN") {
    return { error: "관리자 권한이 필요합니다.", status: 403 as const };
  }

  return { session };
}
