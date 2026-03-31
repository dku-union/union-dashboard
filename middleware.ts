import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const publicPaths = ["/", "/login", "/signup"];
const publicAssetPrefixes = ["/landing/"];
const publicFilePattern = /\.(?:png|webp|jpg|jpeg|gif|svg|ico|bmp|avif)$/i;

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get("union-session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; email: string; name: string; role: string; hasWorkspace?: boolean };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    publicAssetPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    publicFilePattern.test(pathname)
  ) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(request);

  if (publicPaths.includes(pathname)) {
    if (session) {
      const dest = session.role === "ROLE_ADMIN" ? "/admin" : "/dashboard";
      if (pathname === "/login" || pathname === "/signup") {
        return NextResponse.redirect(new URL(dest, request.url));
      }
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const hasWorkspace = session.hasWorkspace ?? true;
  if (!hasWorkspace && session.role !== "ROLE_ADMIN") {
    if (!pathname.startsWith("/workspace/new") && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/workspace/new", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
