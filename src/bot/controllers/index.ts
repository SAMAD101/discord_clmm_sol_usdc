import { open_position, close_position, fetchPositionInfo, listPositions } from "../../utils";
import { harvest_all_locked_positions } from "../../utils/harvest_all_locked_positions";
import { harvest_locked_position } from "../../utils/harvest_locked_position";

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

export const harvestLockedPositionController = async (lockNftMint: string) => {
  return await harvest_locked_position(lockNftMint);
};

export const harvestAllLockedPositionsController = async () => {
  return await harvest_all_locked_positions();
};
