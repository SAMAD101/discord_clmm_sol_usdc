import IORedis from "ioredis";

export const connection = new IORedis({
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!),
  maxRetriesPerRequest: null,
});

export default connection;
