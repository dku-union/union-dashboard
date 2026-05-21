CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('workspace_invitation', 'review_result', 'general');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"publisher_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" varchar(500),
	"is_read" boolean DEFAULT false NOT NULL,
	"reference_id" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workspace_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "workspace_role" NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"invited_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "workspace_invitations_workspace_id_email_unique" UNIQUE("workspace_id","email")
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_publisher_id_publishers_publisher_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."publishers"("publisher_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_invited_by_publishers_publisher_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."publishers"("publisher_id") ON DELETE no action ON UPDATE no action;