CREATE EXTENSION IF NOT EXISTS citext;
ALTER TABLE "workspaces" ALTER COLUMN "name" SET DATA TYPE citext, ADD CONSTRAINT name_length_check CHECK (length(name) <= 100);--> statement-breakpoint

CREATE UNIQUE INDEX "unique_name_per_user" ON "workspaces" USING btree ("user_id","name");--> statement-breakpoint
-- CREATE UNIQUE INDEX "unique_slug_per_user" ON "workspaces" USING btree ("user_id","slug");--> statement-breakpoint
CREATE INDEX "idx_workspaces_owner" ON "workspaces" USING btree ("user_id");