CREATE TYPE "public"."pub_status" AS ENUM('ACTIVE', 'SUSPENDED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."publisher_role" AS ENUM('ROLE_USER', 'ROLE_ADMIN');--> statement-breakpoint
CREATE TABLE "publishers" (
	"publisher_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"contact_email" varchar(255),
	"pubstatus" "pub_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"role" "publisher_role" DEFAULT 'ROLE_USER' NOT NULL,
	CONSTRAINT "publishers_email_unique" UNIQUE("email")
);
