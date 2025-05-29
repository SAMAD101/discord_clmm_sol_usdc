import { ClientEvents } from "discord.js";

export type Event<K extends keyof ClientEvents> = {
  name: K;
  once?: boolean;
  execute: (...args: ClientEvents[K]) => Promise<void>;
};
