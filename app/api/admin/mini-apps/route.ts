import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminMiniApps } from "@/lib/admin/mini-apps";

export async function GET() {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const apps = await listAdminMiniApps();
    return NextResponse.json({ apps });
  } catch (error) {
    console.error("GET /api/admin/mini-apps error:", error);
    return NextResponse.json({ error: "미니앱 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

