import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { listAdminUsers } from "@/lib/admin/users";

export async function GET() {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const data = await listAdminUsers();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "플랫폼 계정 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

