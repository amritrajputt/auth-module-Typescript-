CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(45) NOT NULL,
	"last_name" varchar(45) NOT NULL,
	"email" varchar(322) NOT NULL,
	"password" varchar(128) NOT NULL,
	"salt" varchar(128) NOT NULL,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
