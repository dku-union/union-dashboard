import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import { updateAdminMiniAppStatus } from "@/lib/admin/mini-apps";
import { adminMiniAppStatusSchema } from "@/lib/validations";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive("유효하지 않은 미니앱 ID입니다."),
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

  const parsedBody = adminMiniAppStatusSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: parsedBody.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const result = await updateAdminMiniAppStatus(parsedParams.data.id, parsedBody.data.status);
    if (!result) {
      return NextResponse.json({ error: "미니앱을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH /api/admin/mini-apps/[id]/status error:", error);
    return NextResponse.json({ error: "미니앱 상태를 변경하지 못했습니다." }, { status: 500 });
  }
}

