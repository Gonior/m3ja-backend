ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;