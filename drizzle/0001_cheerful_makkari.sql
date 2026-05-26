CREATE TYPE "public"."report_action" AS ENUM('NONE', 'WARN', 'HOLD_APP', 'SUSPEND_APP', 'DELETE_APP', 'SUSPEND_USER');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('SPAM', 'SCAM', 'INAPPROPRIATE_CONTENT', 'HARASSMENT', 'PRIVACY_VIOLATION', 'POLICY_VIOLATION', 'ETC');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('PENDING', 'IN_PROGRESS', 'VALID', 'REJECTED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."report_target_type" AS ENUM('MINI_APP', 'REVIEW', 'USER');--> statement-breakpoint
CREATE TABLE "reports" (
	"report_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_type" "report_target_type" NOT NULL,
	"reporter_user_id" uuid NOT NULL,
	"target_mini_app_id" integer,
	"target_review_id" uuid,
	"reported_user_id" uuid,
	"reason" "report_reason" NOT NULL,
	"detail" text,
	"status" "report_status" DEFAULT 'PENDING' NOT NULL,
	"action_taken" "report_action" DEFAULT 'NONE' NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp,
	"admin_memo" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "chk_reports_target_fk_matches_type" CHECK ((
        ("reports"."target_type" = 'MINI_APP' AND "reports"."target_mini_app_id" IS NOT NULL AND "reports"."target_review_id" IS NULL AND "reports"."reported_user_id" IS NULL)
        OR ("reports"."target_type" = 'REVIEW' AND "reports"."target_mini_app_id" IS NULL AND "reports"."target_review_id" IS NOT NULL AND "reports"."reported_user_id" IS NULL)
        OR ("reports"."target_type" = 'USER' AND "reports"."target_mini_app_id" IS NULL AND "reports"."target_review_id" IS NULL AND "reports"."reported_user_id" IS NOT NULL)
      ));--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_target_mini_app_id_mini_apps_id_fk" FOREIGN KEY ("target_mini_app_id") REFERENCES "public"."mini_apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_target_review_id_reviews_id_fk" FOREIGN KEY ("target_review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_users_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_publishers_publisher_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."publishers"("publisher_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_reports_status_created_at" ON "reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_reports_target_mini_app_id" ON "reports" USING btree ("target_mini_app_id");--> statement-breakpoint
CREATE INDEX "idx_reports_target_review_id" ON "reports" USING btree ("target_review_id");--> statement-breakpoint
CREATE INDEX "idx_reports_reported_user_id" ON "reports" USING btree ("reported_user_id");--> statement-breakpoint
CREATE INDEX "idx_reports_reporter_user_id" ON "reports" USING btree ("reporter_user_id");
