import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { springFetch } from "@/lib/spring/client";
import { canWriteAppVersion, getVersionMembership } from "@/lib/app-versions/access";

interface TestSessionResponse {
  testLink: string;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }

  const { id } = await params;

  try {
    if (session.role !== "ROLE_ADMIN") {
      const membership = await getVersionMembership(id, session.id);
      if (!membership) {
        return NextResponse.json({ error: "Version access is not allowed." }, { status: 403 });
      }
      if (!canWriteAppVersion(membership.role)) {
        return NextResponse.json({ error: "Test session permission is required." }, { status: 403 });
      }
    }

    const result = await springFetch<TestSessionResponse>(
      `/app-versions/${id}/test-session`,
      session,
      { method: "POST" },
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("POST /api/app-versions/[id]/test-session error:", error);
    return NextResponse.json({ error: "Server error occurred." }, { status: 500 });
  }
}
