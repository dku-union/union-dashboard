import { pgTable, uuid, varchar, timestamp, pgEnum, boolean, serial, unique, text, bigint } from "drizzle-orm/pg-core";

export const pubStatusEnum = pgEnum("pub_status", [
  "ACTIVE",
  "SUSPENDED",
  "PENDING",
]);

export const publisherRoleEnum = pgEnum("publisher_role", [
  "ROLE_USER",
  "ROLE_ADMIN",
]);

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "owner",
  "admin",
  "developer",
  "viewer",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "workspace_invitation",
  "review_result",
  "general",
]);

export const emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  verified: boolean("verified").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const publishers = pgTable("publishers", {
  publisherId: uuid("publisher_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  pubstatus: pubStatusEnum("pubstatus").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
  role: publisherRoleEnum("role").notNull().default("ROLE_USER"),
  id: bigint("id", { mode: "number" }).notNull().generatedByDefaultAsIdentity(),
  description: text("description"),
});

export const workspaces = pgTable("workspaces", {
  workspaceId: uuid("workspace_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).default("#2563EB"),
  ownerId: uuid("owner_id").references(() => publishers.publisherId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: serial("id").primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.workspaceId, { onDelete: "cascade" }),
    publisherId: uuid("publisher_id")
      .notNull()
      .references(() => publishers.publisherId, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull(),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (t) => [unique().on(t.workspaceId, t.publisherId)],
);

export const workspaceInvitations = pgTable(
  "workspace_invitations",
  {
    id: serial("id").primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.workspaceId, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    role: workspaceRoleEnum("role").notNull(),
    status: invitationStatusEnum("status").notNull().default("pending"),
    invitedBy: uuid("invited_by")
      .notNull()
      .references(() => publishers.publisherId),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [unique().on(t.workspaceId, t.email)],
);

export const miniApps = pgTable("mini_apps", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  iconUrl: varchar("icon_url", { length: 500 }),
  status: varchar("status", { length: 20 }).notNull().default("PENDING"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.workspaceId),
  universityId: bigint("university_id", { mode: "number" }),
  tags: varchar("tags", { length: 255 }),
  categoryId: bigint("category_id", { mode: "number" }),
  appId: varchar("app_id", { length: 255 }),
  searchableName: varchar("searchable_name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const appVersions = pgTable("app_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  miniAppId: bigint("mini_app_id", { mode: "number" })
    .notNull()
    .references(() => miniApps.id),
  versionNumber: varchar("version_number", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("DRAFT"),
  buildFileUrl: varchar("build_file_url", { length: 1000 }),
  bundleSize: bigint("bundle_size", { mode: "number" }),
  releaseNotes: text("release_notes"),
  testedAt: timestamp("tested_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  versionId: uuid("version_id")
    .notNull()
    .references(() => appVersions.id),
  reviewerId: uuid("reviewer_id").references(() => publishers.publisherId),
  verdict: varchar("verdict", { length: 20 }).notNull(),
  reason: text("reason"),
  decidedAt: timestamp("decided_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  publisherId: uuid("publisher_id")
    .notNull()
    .references(() => publishers.publisherId, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: varchar("message", { length: 500 }),
  isRead: boolean("is_read").notNull().default(false),
  referenceId: varchar("reference_id", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  workspaceId: uuid("workspace_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).default("#2563EB"),
  ownerId: uuid("owner_id").references(() => publishers.publisherId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: serial("id").primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.workspaceId, { onDelete: "cascade" }),
    publisherId: uuid("publisher_id")
      .notNull()
      .references(() => publishers.publisherId, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull(),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (t) => [unique().on(t.workspaceId, t.publisherId)],
);

export const workspaceInvitations = pgTable(
  "workspace_invitations",
  {
    id: serial("id").primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.workspaceId, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    role: workspaceRoleEnum("role").notNull(),
    status: invitationStatusEnum("status").notNull().default("pending"),
    invitedBy: uuid("invited_by")
      .notNull()
      .references(() => publishers.publisherId),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [unique().on(t.workspaceId, t.email)],
);

export const miniApps = pgTable("mini_apps", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  iconUrl: varchar("icon_url", { length: 500 }),
  status: varchar("status", { length: 20 }).notNull().default("PENDING"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.workspaceId),
  universityId: bigint("university_id", { mode: "number" }),
  tags: varchar("tags", { length: 255 }),
  categoryId: bigint("category_id", { mode: "number" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  publisherId: uuid("publisher_id")
    .notNull()
    .references(() => publishers.publisherId, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: varchar("message", { length: 500 }),
  isRead: boolean("is_read").notNull().default(false),
  referenceId: varchar("reference_id", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});
