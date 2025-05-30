CREATE TABLE "positions_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"pool_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "positions_table" ADD CONSTRAINT "positions_table_wallet_id_wallets_table_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets_table"("id") ON DELETE no action ON UPDATE no action;