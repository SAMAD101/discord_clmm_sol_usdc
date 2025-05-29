import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";

export const closePosition: Command = {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Close a position on Raydium")
    .addStringOption((option) =>
      option
        .setName("pool")
        .setDescription("The pool to close a position on")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Closing a position on Raydium",
      ephemeral: true,
    });
  },
};
