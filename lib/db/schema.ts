import { pgTable, uuid, varchar, timestamp, pgEnum, boolean, serial, unique, text } from "drizzle-orm/pg-core";

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
