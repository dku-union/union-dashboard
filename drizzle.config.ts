import "dotenv/config";

const config = {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: [
    "publishers",
    "email_verifications",
    "workspaces",
    "workspace_members",
    "workspace_invitations",
    "notifications",
    "mini_apps",
    "app_versions",
    "reviews",
  ],
};

export default config;
