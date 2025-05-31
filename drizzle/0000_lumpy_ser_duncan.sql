CREATE TABLE "positions_table" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"pool_id" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets_table" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
