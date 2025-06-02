import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";
import { openPositionController } from "../controllers";

export const openPosition: Command = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a position on Raydium")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of SOL to open a position on")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getString("amount");
    if (!amount) {
      await interaction.reply({
        content: "Please provide an amount",
        ephemeral: true,
      });
      return;
    }
    const result = await openPositionController(amount);
    await interaction.reply({
      content: `Position opened: ${result}`,
      ephemeral: true,
    });
  },
};
