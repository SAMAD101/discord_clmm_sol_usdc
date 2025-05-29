import { Queue, Worker } from "bullmq";
import { connection } from "./redis";

export const queue = new Queue("liquidity-management", { connection });

export const openPositionWorker = new Worker("openPosition", async (job) => {
  const { address } = job.data;
  console.log(`Opening position for ${address}`);
});

export const closePositionWorker = new Worker("closePosition", async (job) => {
  const { address } = job.data;
  console.log(`Closing position for ${address}`);
});
