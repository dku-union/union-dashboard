import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { reports } from "@/lib/db/schema";
import { ReportAction, ReportStatus } from "@/types/admin";

const reportActionSchema = z.enum([
  "NONE",
  "WARN",
  "HOLD_APP",
  "SUSPEND_APP",
  "DELETE_APP",
  "SUSPEND_USER",
]);

const reportStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "VALID",
  "REJECTED",
  "ARCHIVED",
]);

const updateReportSchema = z.object({
  status: reportStatusSchema,
  actionTaken: reportActionSchema,
  adminMemo: z.string().max(2000).nullable().optional(),
});

function validateAction(status: ReportStatus, actionTaken: ReportAction) {
  if (status === "VALID" && actionTaken === "NONE") {
    return "타당 처리에는 조치가 필요합니다.";
  }

  if ((status === "PENDING" || status === "IN_PROGRESS" || status === "REJECTED") && actionTaken !== "NONE") {
    return "대기, 처리 중, 기각 상태에서는 조치를 지정할 수 없습니다.";
  }

  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session || session.role !== "ROLE_ADMIN") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = updateReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  const { status, actionTaken, adminMemo } = parsed.data;
  const validationError = validateAction(status, actionTaken);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const reviewedAt = new Date();
    const [updatedReport] = await db
      .update(reports)
      .set({
        status,
        actionTaken,
        reviewedBy: session.id,
        reviewedAt,
        adminMemo: adminMemo ?? null,
        updatedAt: reviewedAt,
      })
      .where(eq(reports.reportId, id))
      .returning({
        id: reports.reportId,
        status: reports.status,
        actionTaken: reports.actionTaken,
        reviewedAt: reports.reviewedAt,
        adminMemo: reports.adminMemo,
      });

    if (!updatedReport) {
      return NextResponse.json({ error: "신고를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
      report: {
        id: updatedReport.id,
        status: updatedReport.status,
        actionTaken: updatedReport.actionTaken,
        reviewedByName: session.name,
        reviewedAt: updatedReport.reviewedAt?.toISOString(),
        adminMemo: updatedReport.adminMemo ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to update report:", error);
    return NextResponse.json({ error: "신고 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
