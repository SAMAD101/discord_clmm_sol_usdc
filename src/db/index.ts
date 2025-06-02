import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const db_client = postgres(process.env.DATABASE_URL!, {
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!),
  database: process.env.DATABASE_NAME!,
});

export const db = drizzle(db_client);
