import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  }
});

export default client;
