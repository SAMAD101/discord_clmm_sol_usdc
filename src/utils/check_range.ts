import { ApiV3PoolInfoConcentratedItem, ClmmKeys, TickUtils } from "@raydium-io/raydium-sdk-v2";
import { fetchPositionInfo, poolId } from ".";
import { initSdk } from "./raydium_config";
import { isValidClmm } from "./clmm_config";
import { Decimal } from "decimal.js";

export const is_in_range = async (positionId: string): Promise<boolean> => {
    const raydium = await initSdk()
    const position = await fetchPositionInfo(positionId)
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

    return position.tickLower >= lowerTick && position.tickUpper <= upperTick
}