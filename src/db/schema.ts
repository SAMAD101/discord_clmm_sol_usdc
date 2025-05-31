import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const walletsTable = pgTable("wallets_table", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const positionsTable = pgTable("positions_table", {
  id: text("id").primaryKey(),
  walletId: text("wallet_id").notNull(),
  poolId: text("pool_id").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
