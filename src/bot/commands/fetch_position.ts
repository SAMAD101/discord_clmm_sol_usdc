import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchPositionController } from "../controllers";

export const fetchPositionCommand = {
  data: new SlashCommandBuilder()
    .setName("fetch-position")
    .setDescription("Fetch the position of the user")
    .addUserOption((option) =>
      option
        .setName("positionId")
        .setDescription("The positionId to fetch the position of")
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
    await interaction.reply({
      content: "Fetching position...",
      ephemeral: true,
    });
    const result = await fetchPositionController(positionId);
    await interaction.reply({
      content: `Position fetched: ${result}`,
      ephemeral: true,
    });
  },
};
