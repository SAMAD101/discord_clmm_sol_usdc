import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";

export const start: Command = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start the bot"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Starting the bot",
      flags: MessageFlags.Ephemeral,
    });
  },
};
