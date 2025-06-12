import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Command } from "./types";

export const start: Command = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start the bot"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: `
--- Solana LP Bot ---
### Commands:
- /start - show this message
- /open <amount> - open a new position
- /close <position_id> - close a position
- /fetch_position <position_id> - fetch a position
------
The bot automatically run check range checks every 30 mins,
and rebalance the position(s) if it is out of range.
`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
