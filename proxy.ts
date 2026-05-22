import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const publicPaths = ["/", "/login", "/signup"];
const publicAssetPrefixes = ["/landing/"];
const publicFilePattern = /\.(?:png|webp|jpg|jpeg|gif|svg|ico|bmp|avif)$/i;

type SessionPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
  hasWorkspace?: boolean;
};

// 토큰 부재(missing) 와 토큰은 있지만 검증 실패(expired/invalid) 를 구분해야
// 만료된 사용자에게 안내 토스트를 띄울 수 있다.
async function getSessionFromRequest(
  request: NextRequest,
): Promise<{ session: SessionPayload | null; hasToken: boolean }> {
  const token = request.cookies.get("union-session")?.value;
  if (!token) return { session: null, hasToken: false };
  try {
    const { payload } = await jwtVerify(token, secret);
    return { session: payload as SessionPayload, hasToken: true };
  } catch {
    return { session: null, hasToken: true };
  }
}

function redirectToLogin(
  request: NextRequest,
  opts: { expired?: boolean; preserveFrom?: boolean } = {},
) {
  const url = new URL("/login", request.url);
  if (opts.preserveFrom !== false) {
    const from = request.nextUrl.pathname + request.nextUrl.search;
    if (from && from !== "/" && !from.startsWith("/login")) {
      url.searchParams.set("from", from);
    }
  }
  if (opts.expired) url.searchParams.set("expired", "1");
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    publicAssetPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    publicFilePattern.test(pathname)
  ) {
    return NextResponse.next();
  }

  const { session, hasToken } = await getSessionFromRequest(request);

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
      return redirectToLogin(request, { expired: hasToken });
    }
    if (session.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return redirectToLogin(request, { expired: hasToken });
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
