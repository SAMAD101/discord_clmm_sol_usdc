import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";
import { closePositionController } from "../controllers";

export const closePosition: Command = {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Close a position on Raydium")
    .addStringOption((option) =>
      option
        .setName("positionId")
        .setDescription("The positionId to close a position on")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const positionId = interaction.options.getString("positionId");
    if (!positionId) {
      await interaction.reply({
        content: "Please provide a positionId",
        ephemeral: true,
      });
      return;
    }
    const result = await closePositionController(positionId);
    await interaction.reply({
      content: `Position closed: ${result}`,
      ephemeral: true,
    });
  },
};
