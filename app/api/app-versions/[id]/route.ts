import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { AppVersion } from "@/types/app-version";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await springFetch<AppVersion>(`/app-versions/${id}`, session);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("GET /api/app-versions/[id] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
