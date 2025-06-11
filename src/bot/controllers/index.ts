import { open_position, close_position, fetchPositionInfo, listPositions } from "../../utils";

export const openPositionController = async (amount: string) => {
  return await open_position(amount);
};

export const closePositionController = async (positionId: string) => {
  return await close_position(positionId);
};

export const fetchPositionController = async (positionId: string) => {
  return await fetchPositionInfo(positionId);
};

export const listPositionsController = async () => {
  return await listPositions();
};
