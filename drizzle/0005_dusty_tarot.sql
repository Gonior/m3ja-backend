ALTER TABLE "user_tokens" RENAME COLUMN "expired_at" TO "expires_at";--> statement-breakpoint
ALTER TABLE "user_tokens" ADD COLUMN "jti" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_jti_unique" UNIQUE("jti");