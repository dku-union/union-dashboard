import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import type { Review, SubmitReviewRequest } from "@/types/app-version";

// 심사 요청 제출
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body: SubmitReviewRequest = await request.json();
    if (!body.versionId) {
      return NextResponse.json({ error: "versionId가 필요합니다." }, { status: 400 });
    }

    const result = await springFetch<Review>("/reviews", session, {
      method: "POST",
      body: { versionId: body.versionId },
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
