CREATE TYPE "public"."workspace_role" AS ENUM('owner', 'admin', 'developer', 'viewer');--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" uuid NOT NULL,
	"publisher_id" uuid NOT NULL,
	"role" "workspace_role" NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	CONSTRAINT "workspace_members_workspace_id_publisher_id_unique" UNIQUE("workspace_id","publisher_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"workspace_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"contact_email" varchar(255) NOT NULL,
	"color" varchar(7) DEFAULT '#2563EB',
	"owner_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_publisher_id_publishers_publisher_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."publishers"("publisher_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_publishers_publisher_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."publishers"("publisher_id") ON DELETE no action ON UPDATE no action;