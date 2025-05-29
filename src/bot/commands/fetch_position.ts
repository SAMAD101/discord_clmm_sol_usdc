import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchPositionController } from "../controllers";

export const fetchPositionCommand = {
  data: new SlashCommandBuilder()
    .setName("fetch-position")
    .setDescription("Fetch the position of the user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to fetch the position of")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Fetching position...",
      ephemeral: true,
    });
  },
};
