import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { fetchPositionController } from "../controllers";

export const fetchPositionCommand = {
  data: new SlashCommandBuilder()
    .setName("fetch-position")
    .setDescription("Fetch the position of the user")
    .addUserOption((option) =>
      option
        .setName("id")
        .setDescription("The position ID to fetch the position of")
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
    await interaction.reply({
      content: "Fetching position...",
      ephemeral: true,
    });
    const result = await fetchPositionController(positionId);
    await interaction.reply({
      content: `Position fetched:\n ${JSON.stringify(result, null, 2)}`,
      ephemeral: true,
    });
  },
};
