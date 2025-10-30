ALTER TABLE "workspaces" RENAME COLUMN "user_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "unique_name_per_user";--> statement-breakpoint
DROP INDEX "idx_workspaces_owner";--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "slug" citext CHECK (length(slug) <= 100);--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_name_per_user" ON "workspaces" USING btree ("owner_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_slug_per_user" ON "workspaces" USING btree ("owner_id","slug");--> statement-breakpoint
CREATE INDEX "idx_workspaces_owner" ON "workspaces" USING btree ("owner_id");