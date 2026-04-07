import { z } from "zod";
import { ADMIN_REVIEWABLE_VERSION_STATUSES } from "@/types/admin-review";

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
    password: z
      .string()
      .min(10, "비밀번호는 10자 이상이어야 합니다.")
      .max(128, "비밀번호는 128자 이하여야 합니다.")
      .regex(/[A-Za-z]/, "비밀번호에 영문자를 포함해야 합니다.")
      .regex(/[0-9]/, "비밀번호에 숫자를 포함해야 합니다.")
      .regex(/[^A-Za-z0-9]/, "비밀번호에 특수문자를 포함해야 합니다.")
      .regex(/^\S+$/, "비밀번호에 공백을 포함할 수 없습니다."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const miniAppSchema = z.object({
  name: z
    .string()
    .min(2, "앱 이름은 2자 이상이어야 합니다.")
    .max(30, "앱 이름은 30자 이하여야 합니다."),
  shortDescription: z
    .string()
    .min(10, "한줄 소개는 10자 이상이어야 합니다.")
    .max(80, "한줄 소개는 80자 이하여야 합니다."),
  description: z
    .string()
    .min(50, "설명은 50자 이상이어야 합니다.")
    .max(2000, "설명은 2000자 이하여야 합니다."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  keywords: z.array(z.string()).min(1, "키워드를 1개 이상 입력해주세요.").max(10, "키워드는 최대 10개까지 가능합니다."),
  permissions: z.array(z.string()),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "버전 형식은 x.y.z 이어야 합니다.").optional(),
  releaseNote: z.string().optional(),
});

export type MiniAppFormValues = z.infer<typeof miniAppSchema>;

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "워크스페이스 이름은 2자 이상이어야 합니다.")
    .max(100, "워크스페이스 이름은 100자 이하여야 합니다."),
  description: z
    .string()
    .max(500, "설명은 500자 이하여야 합니다.")
    .optional(),
  contactEmail: z.string().email("유효한 이메일 주소를 입력해주세요."),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "유효한 색상 코드를 입력해주세요.")
    .optional(),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  role: z.enum(["admin", "developer", "viewer"], {
    message: "역할을 선택해주세요.",
  }),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export const createMiniAppSchema = z.object({
  name: z
    .string()
    .min(2, "앱 이름은 2자 이상이어야 합니다.")
    .max(100, "앱 이름은 100자 이하여야 합니다."),
  description: z.string().max(2000, "설명은 2000자 이하여야 합니다.").optional(),
});

export type CreateMiniAppFormValues = z.infer<typeof createMiniAppSchema>;

export const createVersionSchema = z.object({
  miniAppId: z.number().int().positive("미니앱 ID가 필요합니다."),
  versionNumber: z.string().regex(/^\d+\.\d+\.\d+$/, "버전 형식은 x.y.z 이어야 합니다."),
  releaseNotes: z.string().max(2000).optional(),
});

export type CreateVersionFormValues = z.infer<typeof createVersionSchema>;

export const adminReviewListQuerySchema = z.object({
  status: z.enum(ADMIN_REVIEWABLE_VERSION_STATUSES).optional(),
  q: z.string().trim().max(100).optional(),
});

export const adminRejectReviewSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "반려 사유를 입력해주세요.")
    .max(2000, "반려 사유는 2000자 이하여야 합니다."),
});

export type AdminReviewListQuery = z.infer<typeof adminReviewListQuerySchema>;
export type AdminRejectReviewFormValues = z.infer<typeof adminRejectReviewSchema>;
