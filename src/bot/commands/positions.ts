import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";

export const positions: Command = {
  data: new SlashCommandBuilder()
    .setName("positions")
    .setDescription("Get all positions on Raydium"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Getting all positions on Raydium",
      ephemeral: true,
    });
  },
};
