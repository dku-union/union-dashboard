import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { Review } from "@/types/app-version";

// 내 심사 목록 조회
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const result = await springFetch<Review[]>("/reviews/mine", session);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("GET /api/reviews/mine error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
