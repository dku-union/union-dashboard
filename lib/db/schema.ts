import { sql } from "drizzle-orm";
import { check, index, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const pubStatusEnum = pgEnum("pub_status", [
  "ACTIVE",
  "SUSPENDED",
  "PENDING",
]);

export const publisherRoleEnum = pgEnum("publisher_role", [
  "ROLE_USER",
  "ROLE_ADMIN",
]);

export const reportTargetTypeEnum = pgEnum("report_target_type", [
  "MINI_APP",
  "REVIEW",
  "USER",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "PENDING",
  "IN_PROGRESS",
  "VALID",
  "REJECTED",
  "ARCHIVED",
]);

export const reportReasonEnum = pgEnum("report_reason", [
  "SPAM",
  "SCAM",
  "INAPPROPRIATE_CONTENT",
  "HARASSMENT",
  "PRIVACY_VIOLATION",
  "POLICY_VIOLATION",
  "ETC",
]);

export const reportActionEnum = pgEnum("report_action", [
  "NONE",
  "WARN",
  "HOLD_APP",
  "SUSPEND_APP",
  "DELETE_APP",
  "SUSPEND_USER",
]);

export const publishers = pgTable("publishers", {
  publisherId: uuid("publisher_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  pubstatus: pubStatusEnum("pubstatus").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
  role: publisherRoleEnum("role").notNull().default("ROLE_USER"),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull(),
  nickname: varchar("nickname", { length: 50 }).notNull(),
});

export const miniApps = pgTable("mini_apps", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey(),
});

export const reports = pgTable(
  "reports",
  {
    reportId: uuid("report_id").primaryKey().defaultRandom(),
    targetType: reportTargetTypeEnum("target_type").notNull(),
    reporterUserId: uuid("reporter_user_id").notNull().references(() => users.id),
    targetMiniAppId: integer("target_mini_app_id").references(() => miniApps.id),
    targetReviewId: uuid("target_review_id").references(() => reviews.id),
    reportedUserId: uuid("reported_user_id").references(() => users.id),
    reason: reportReasonEnum("reason").notNull(),
    detail: text("detail"),
    status: reportStatusEnum("status").notNull().default("PENDING"),
    actionTaken: reportActionEnum("action_taken").notNull().default("NONE"),
    reviewedBy: uuid("reviewed_by").references(() => publishers.publisherId),
    reviewedAt: timestamp("reviewed_at"),
    adminMemo: text("admin_memo"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    check(
      "chk_reports_target_fk_matches_type",
      sql`(
        (${table.targetType} = 'MINI_APP' AND ${table.targetMiniAppId} IS NOT NULL AND ${table.targetReviewId} IS NULL AND ${table.reportedUserId} IS NULL)
        OR (${table.targetType} = 'REVIEW' AND ${table.targetMiniAppId} IS NULL AND ${table.targetReviewId} IS NOT NULL AND ${table.reportedUserId} IS NULL)
        OR (${table.targetType} = 'USER' AND ${table.targetMiniAppId} IS NULL AND ${table.targetReviewId} IS NULL AND ${table.reportedUserId} IS NOT NULL)
      )`,
    ),
    index("idx_reports_status_created_at").on(table.status, table.createdAt),
    index("idx_reports_target_mini_app_id").on(table.targetMiniAppId),
    index("idx_reports_target_review_id").on(table.targetReviewId),
    index("idx_reports_reported_user_id").on(table.reportedUserId),
    index("idx_reports_reporter_user_id").on(table.reporterUserId),
  ],
);
