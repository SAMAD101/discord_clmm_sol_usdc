import { openPosition } from "./open";
import { closePosition } from "./close";
import { positions } from "./positions";
import { start } from "./start";
import { fetchPositionCommand } from "./fetch_position";
import { Collection } from "discord.js";
import { Command } from "./types";

export const commands = new Collection<string, Command>();

commands.set(openPosition.data.name, openPosition);
commands.set(closePosition.data.name, closePosition);
commands.set(fetchPositionCommand.data.name, fetchPositionCommand);
commands.set(positions.data.name, positions);
commands.set(start.data.name, start);
