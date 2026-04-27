import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { springFetch } from "@/lib/spring/client";
import type { Review } from "@/types/app-version";

// 심사 승인 (Spring 프록시)
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  try {
    const result = await springFetch<Review>(`/reviews/${id}/decision`, auth.session, {
      method: "POST",
      body: { verdict: "ACCEPTED" },
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("POST /api/admin/reviews/[id]/approve error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
