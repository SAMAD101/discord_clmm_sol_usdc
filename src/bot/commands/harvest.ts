import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";
import { closePositionController, harvestLockedPositionController } from "../controllers";

export const harvestLockedPosition: Command = {
  data: new SlashCommandBuilder()
    .setName("harvest")
    .setDescription("Harvest a locked position on Raydium")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The position ID to harvest")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const positionId = interaction.options.getString("id");
    if (!positionId) {
      await interaction.reply({
        content: "Please provide a position ID",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const result = await harvestLockedPositionController(positionId);

    await interaction.editReply({
      content: `Position harvested: ${result}`,
    });
  },
};
