import { signInternalToken } from "./jwt";

const SPRING_API_URL = process.env.SPRING_API_URL!;

interface SpringFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

interface SpringSession {
  id: string;
  role: string;
}

export async function springFetch<T = unknown>(
  path: string,
  session: SpringSession,
  options: SpringFetchOptions = {},
): Promise<{ data: T; status: number } | { error: string; status: number }> {
  const { method = "GET", body } = options;

  const springRole = session.role === "ROLE_ADMIN" ? "ROLE_ADMIN" : "ROLE_PUBLISHER";
  const token = await signInternalToken(session.id, springRole);

  try {
    const res = await fetch(`${SPRING_API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        error: data?.message || data?.error || "Spring 서버 오류가 발생했습니다.",
        status: res.status,
      };
    }

    return { data: data as T, status: res.status };
  } catch {
    return { error: "백엔드 서버에 연결할 수 없습니다.", status: 502 };
  }
}
