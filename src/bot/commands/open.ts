import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";

export const openPosition: Command = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a position on Raydium")
    .addStringOption((option) =>
      option
        .setName("pool")
        .setDescription("The pool to open a position on")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Open a position on Raydium",
      ephemeral: true,
    });
  },
};
