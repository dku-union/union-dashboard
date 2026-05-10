import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import { createVersionSchema } from "@/lib/validations";
import type { CreateVersionResponse, AppVersion } from "@/types/app-version";
import { canWriteAppVersion, getMiniAppMembership } from "@/lib/app-versions/access";

// 버전 생성 (DRAFT + GCS 업로드 URL 반환)
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createVersionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
    }

    const membership = await getMiniAppMembership(parsed.data.miniAppId, session.id);
    if (!membership) {
      return NextResponse.json({ error: "앱 접근 권한이 없습니다." }, { status: 403 });
    }
    if (!canWriteAppVersion(membership.role)) {
      return NextResponse.json({ error: "버전 업로드 권한이 없습니다." }, { status: 403 });
    }

    const result = await springFetch<CreateVersionResponse>("/app-versions", session, {
      method: "POST",
      body: parsed.data,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("POST /api/app-versions error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 미니앱별 버전 목록
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const miniAppId = searchParams.get("miniAppId");
  if (!miniAppId) {
    return NextResponse.json({ error: "miniAppId가 필요합니다." }, { status: 400 });
  }

  try {
    const numericMiniAppId = Number(miniAppId);
    if (!Number.isInteger(numericMiniAppId) || numericMiniAppId <= 0) {
      return NextResponse.json({ error: "miniAppId가 올바르지 않습니다." }, { status: 400 });
    }

    const membership = await getMiniAppMembership(numericMiniAppId, session.id);
    if (!membership) {
      return NextResponse.json({ error: "앱 접근 권한이 없습니다." }, { status: 403 });
    }

    const result = await springFetch<AppVersion[]>(
      `/app-versions/mini-app/${miniAppId}`,
      session,
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("GET /api/app-versions error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
