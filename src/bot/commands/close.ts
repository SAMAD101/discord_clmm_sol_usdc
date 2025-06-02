import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";
import { closePositionController } from "../controllers";

export const closePosition: Command = {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Close a position on Raydium")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The position ID to close")
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

    const result = await closePositionController(positionId);

    await interaction.editReply({
      content: `Position closed: ${result}`,
    });
  },
};
