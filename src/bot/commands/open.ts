import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";
import { openPositionController } from "../controllers";

export const openPosition: Command = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a position on Raydium")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of SOL open a position with")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getString("amount");
    if (!amount) {
      await interaction.reply({
        content: "Please provide an amount",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const result = await openPositionController(amount);

    await interaction.editReply({
      content: `Position opened: ${result}`,
    });
  },
};
