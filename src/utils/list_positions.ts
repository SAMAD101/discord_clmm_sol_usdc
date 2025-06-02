import { db } from "../db";
import { positionsTable } from "../db/schema";

export const listPositions = async () => {
  const positions = await db.select().from(positionsTable);
  return positions;
};
