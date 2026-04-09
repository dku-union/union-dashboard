import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAdminDashboardData } from "@/lib/admin/dashboard";

export async function GET() {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const dashboard = await getAdminDashboardData();
    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json({ error: "대시보드 데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}

