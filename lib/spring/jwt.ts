import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.INTERNAL_JWT_SECRET!);

export async function signInternalToken(sub: string, role: string): Promise<string> {
  return new SignJWT({ sub, role })
    .setProtectedHeader({ alg: "HS512" })
    .setIssuer("union-dashboard")
    .setIssuedAt()
    .setExpirationTime("30s")
    .sign(secret);
}
