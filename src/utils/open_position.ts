import {
  ApiV3PoolInfoConcentratedItem,
  TickUtils,
  PoolUtils,
  ClmmKeys,
} from "@raydium-io/raydium-sdk-v2";
import BN from "bn.js";
import { initSdk, txVersion, ownerPublicKey } from "./raydium_config";
import Decimal from "decimal.js";
import { isValidClmm } from "./clmm_config";
import { poolId, Position } from ".";
import { db } from "../db";
import { positionsTable } from "../db/schema";

export const open_position = async (amount: string): Promise<Position> => {
  const raydium = await initSdk();

  let poolInfo: ApiV3PoolInfoConcentratedItem;
  let poolKeys: ClmmKeys | undefined;

  if (raydium.cluster === "mainnet") {
    const data = await raydium.api.fetchPoolById({ ids: poolId });
    poolInfo = data[0] as ApiV3PoolInfoConcentratedItem;
    if (!isValidClmm(poolInfo.programId))
      throw new Error("target pool is not CLMM pool");
  } else {
    const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
    poolInfo = data.poolInfo;
    poolKeys = data.poolKeys;
  }

  const currentPrice = poolInfo.price;
  // -2.5% and +2.5% : 5% price range
  const [startPrice, endPrice] = [currentPrice * 0.975, currentPrice * 1.025];

  const { tick: lowerTick } = TickUtils.getPriceAndTick({
    poolInfo,
    price: new Decimal(startPrice),
    baseIn: true,
  });

  const { tick: upperTick } = TickUtils.getPriceAndTick({
    poolInfo,
    price: new Decimal(endPrice),
    baseIn: true,
  });

  const epochInfo = await raydium.fetchEpochInfo();
  const res = await PoolUtils.getLiquidityAmountOutFromAmountIn({
    poolInfo,
    slippage: 0.05,
    inputA: true,
    tickUpper: Math.max(lowerTick, upperTick),
    tickLower: Math.min(lowerTick, upperTick),
    amount: new BN(
      new Decimal(amount || "0")
        .mul(10 ** poolInfo.mintA.decimals)
        .toFixed(0),
    ),
    add: true,
    amountHasFee: true,
    epochInfo: epochInfo,
  });

  const { execute, extInfo } = await raydium.clmm.openPositionFromBase({
    poolInfo,
    poolKeys,
    tickUpper: Math.max(lowerTick, upperTick),
    tickLower: Math.min(lowerTick, upperTick),
    base: "MintA",
    ownerInfo: {
      useSOLBalance: true,
    },
    baseAmount: new BN(
      new Decimal(amount || "0")
        .mul(10 ** poolInfo.mintA.decimals)
        .toFixed(0),
    ),
    otherAmountMax: res.amountSlippageB.amount,
    txVersion,
    // optional: set up priority fee here
    computeBudgetConfig: {
      units: 600000,
      microLamports: 100000,
    },
  });

  const { txId } = await execute({ sendAndConfirm: true });
  console.log("clmm position opened:", {
    txId,
    nft: extInfo.nftMint.toBase58(),
  });

  console.log("txId", txId);

  await db.insert(positionsTable).values([{
    id: extInfo.nftMint.toBase58(),
    walletId: ownerPublicKey,
    amount: amount,
    poolId: poolInfo.id,
    status: "open",
    createdAt: new Date(),
    updatedAt: new Date(),
  }]);

  return {
    id: extInfo.nftMint.toBase58(),
    amount: Number(amount),
    pool: `${poolInfo.mintA.symbol} - ${poolInfo.mintB.symbol}`,
  };
};
