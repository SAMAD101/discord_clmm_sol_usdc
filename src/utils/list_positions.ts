import { eq } from "drizzle-orm";
import { db } from "../db";
import { positionsTable } from "../db/schema";

export const listPositions = async () => {
  const positions = await db.select().from(positionsTable).where(eq(positionsTable.status, "open"));
  return positions;
};
