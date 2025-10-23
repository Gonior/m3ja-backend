ALTER TABLE "users" ADD COLUMN "avatar_key" text;--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profile_picture_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profile_picture_key";