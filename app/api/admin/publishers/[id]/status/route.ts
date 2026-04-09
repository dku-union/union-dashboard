import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { updateAdminPublisherStatus } from "@/lib/admin/publishers";
import { adminPublisherStatusSchema } from "@/lib/validations";

const paramsSchema = z.object({
  id: z.string().uuid("유효하지 않은 퍼블리셔 ID입니다."),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const parsedParams = paramsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: parsedParams.error.issues[0]?.message ?? "유효하지 않은 ID입니다." }, { status: 400 });
  }

  const parsedBody = adminPublisherStatusSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const result = await updateAdminPublisherStatus(parsedParams.data.id, parsedBody.data.status);
    if (!result) {
      return NextResponse.json({ error: "퍼블리셔를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH /api/admin/publishers/[id]/status error:", error);
    return NextResponse.json({ error: "퍼블리셔 상태를 변경하지 못했습니다." }, { status: 500 });
  }
}

