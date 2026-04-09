import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminPublishers } from "@/lib/admin/publishers";

export async function GET() {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const publishers = await listAdminPublishers();
    return NextResponse.json({ publishers });
  } catch (error) {
    console.error("GET /api/admin/publishers error:", error);
    return NextResponse.json({ error: "퍼블리셔 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

