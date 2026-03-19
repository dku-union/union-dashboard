import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const pubStatusEnum = pgEnum("pub_status", [
  "ACTIVE",
  "SUSPENDED",
  "PENDING",
]);

export const publisherRoleEnum = pgEnum("publisher_role", [
  "ROLE_USER",
  "ROLE_ADMIN",
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
