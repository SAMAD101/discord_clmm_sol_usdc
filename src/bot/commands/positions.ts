import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";
import { listPositionsController } from "../controllers";

export const positions: Command = {
  data: new SlashCommandBuilder()
    .setName("positions")
    .setDescription("Get all positions on Raydium"),
  async execute(interaction: ChatInputCommandInteraction) {
    const result = await listPositionsController();
    const formattedResult = result.map((position) => {
      return `Position ID: ${position.id}, Amount: ${position.poolId}`;
    }).join("\n");
    console.log(formattedResult);

    await interaction.reply({
      content: `Positions: ${formattedResult}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
