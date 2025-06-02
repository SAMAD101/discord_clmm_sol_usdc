import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";
import { listPositionsController } from "../controllers";

export const positions: Command = {
  data: new SlashCommandBuilder()
    .setName("positions")
    .setDescription("Get all positions on Raydium"),
  async execute(interaction: ChatInputCommandInteraction) {
    await listPositionsController();
  },
};
