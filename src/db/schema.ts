import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const walletsTable = pgTable("wallets_table", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const positionsTable = pgTable("positions_table", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => walletsTable.id),
  poolId: text("pool_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
