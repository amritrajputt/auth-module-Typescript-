ALTER TABLE "users" ADD COLUMN "verify_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verify_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_verify_token_unique" UNIQUE("verify_token");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_reset_password_token_unique" UNIQUE("reset_password_token");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_refresh_token_unique" UNIQUE("refresh_token");