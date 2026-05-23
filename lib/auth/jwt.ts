import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  hasWorkspace: boolean;
  /** JWT exp claim (seconds since epoch). verifyToken 으로 검증된 토큰에서만 채워짐. */
  exp?: number;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(payload: SessionPayload): Promise<string> {
  // exp 는 jose 가 자동으로 채우므로 입력에서는 제거.
  const { exp: _ignored, ...input } = payload;
  void _ignored;
  return new SignJWT(input as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const session = payload as unknown as SessionPayload;
    return {
      ...session,
      exp: typeof payload.exp === "number" ? payload.exp : undefined,
    };
  } catch {
    return null;
  }
}
