import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const publicPaths = ["/", "/login", "/signup"];

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
  const session = await getSessionFromRequest(request);

  // Auth pages: redirect logged-in users based on role
  if (pathname === "/" || publicPaths.some((p) => p !== "/" && pathname.startsWith(p))) {
    if (session) {
      const dest =
        session.role === "ROLE_ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // Admin routes: require ROLE_ADMIN
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // All other routes: require authentication
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Workspace redirect: 퍼블리셔가 워크스페이스 없으면 /workspace/new로
  // 기존 JWT에 hasWorkspace가 없으면 true로 간주 (기존 사용자 호환)
  const hasWorkspace = session.hasWorkspace ?? true;
  if (!hasWorkspace && session.role !== "ROLE_ADMIN") {
    // /workspace/new와 /api는 허용
    if (!pathname.startsWith("/workspace/new") && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/workspace/new", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
