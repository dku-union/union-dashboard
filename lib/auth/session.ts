import { cookies } from "next/headers";
import { signToken, verifyToken, SessionPayload } from "./jwt";

const COOKIE_NAME = "union-session";

export async function createSession(publisher: {
  publisherId: string;
  email: string;
  name: string;
  role: string;
}) {
  const token = await signToken({
    id: publisher.publisherId,
    email: publisher.email,
    name: publisher.name,
    role: publisher.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
