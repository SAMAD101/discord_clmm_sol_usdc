import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";

export const wallet: Command = {
  data: new SlashCommandBuilder()
    .setName("wallet")
    .setDescription("Get the wallet address"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Getting the wallet address",
      flags: MessageFlags.Ephemeral,
    });
  },
};
