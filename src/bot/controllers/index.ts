import { Interaction } from "discord.js";
import { queue } from "../../queue";

export const openPositionController = async (
  amount: string,
) => {
  await queue.add("openPosition", {
    amount,
  });
};

export const closePositionController = async (
  positionId: string,
) => {
  await queue.add("closePosition", {
    positionId,
  });
};

export const fetchPositionController = async (
  positionId: string,
) => {
  await queue.add("fetchPosition", {
    positionId,
  });
};

export const listPositionsController = async () => {
  await queue.add("listPositions", {});
};
