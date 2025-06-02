import { Queue, QueueEvents, Worker } from "bullmq";
import { redis } from "./redis";
import { open_position, close_position, fetchPositionInfo, listPositions } from "./utils";

export const queue = new Queue("liquidity-management", { connection: redis });
export const queueEvents = new QueueEvents("liquidity-management", { connection: redis });

export const openPositionWorker = new Worker("openPosition", async (job) => {
  const { amount } = job.data;
  console.log(`Opening position with amount ${amount}`);
  await open_position(amount);
}, { connection: redis });

export const closePositionWorker = new Worker("closePosition", async (job) => {
  const { positionId } = job.data;
  console.log(`Closing position for ${positionId}`);
  await close_position(positionId);
}, { connection: redis });

export const fetchPositionWorker = new Worker("fetchPosition", async (job) => {
  const { positionId } = job.data;
  console.log(`Fetching position for ${positionId}`);
  const result = await fetchPositionInfo(positionId);
  return result;
}, { connection: redis });

export const listPositionsWorker = new Worker("listPositions", async (job) => {
  console.log(`Listing positions for the current user`);
  const result = await listPositions();
  return result;
}, { connection: redis });

