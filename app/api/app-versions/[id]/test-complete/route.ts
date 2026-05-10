import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { AppVersion } from "@/types/app-version";
import { canWriteAppVersion, getVersionMembership } from "@/lib/app-versions/access";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const membership = await getVersionMembership(id, session.id);
    if (!membership) {
      return NextResponse.json({ error: "버전 접근 권한이 없습니다." }, { status: 403 });
    }
    if (!canWriteAppVersion(membership.role)) {
      return NextResponse.json({ error: "테스트 완료 처리 권한이 없습니다." }, { status: 403 });
    }

    const result = await springFetch<AppVersion>(
      `/app-versions/${id}/test-complete`,
      session,
      { method: "POST" },
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("POST /api/app-versions/[id]/test-complete error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
