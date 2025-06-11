import { ApiV3PoolInfoConcentratedItem, ClmmKeys } from '@raydium-io/raydium-sdk-v2'
import { initSdk, txVersion } from './raydium_config'
import { isValidClmm } from './clmm_config'
import { poolId, Position } from '.'
import { positionsTable } from '../db/schema'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { BN } from 'bn.js'

export const close_position = async (positionId: string): Promise<Position> => {
  const raydium = await initSdk()
  let poolInfo: ApiV3PoolInfoConcentratedItem
  let poolKeys: ClmmKeys | undefined

  if (raydium.cluster === 'mainnet') {
    const data = await raydium.api.fetchPoolById({ ids: poolId })
    poolInfo = data[0] as ApiV3PoolInfoConcentratedItem
    if (!isValidClmm(poolInfo.programId)) throw new Error('target pool is not CLMM pool')
  } else {
    const data = await raydium.clmm.getPoolInfoFromRpc(poolId)
    poolInfo = data.poolInfo
    poolKeys = data.poolKeys
  }

  const allPosition = await raydium.clmm.getOwnerPositionInfo({ programId: poolInfo.programId })
  if (!allPosition.length) throw new Error('user do not have any positions')

  const position = allPosition.find((p) => p.poolId.toBase58() === poolInfo.id)
  if (!position) throw new Error(`user do not have position in pool: ${poolInfo.id}`)

  const { execute } = await raydium.clmm.decreaseLiquidity({
    poolInfo,
    poolKeys,
    ownerPosition: position,
    ownerInfo: {
      useSOLBalance: true,
      closePosition: true,
    },
    liquidity: position.liquidity,
    amountMinA: new BN(0),
    amountMinB: new BN(0),
    txVersion,
  }) 

  const { txId } = await execute({ sendAndConfirm: true })
  console.log('clmm position closed:', { txId: `https://explorer.solana.com/tx/${txId}` })

  await db.update(positionsTable).set({
    status: "closed",
    updatedAt: new Date(),
  }).where(eq(positionsTable.id, positionId));

  return {
    id: position.nftMint.toBase58(),
    amount: Number(0),
    pool: `${poolInfo.mintA.symbol} - ${poolInfo.mintB.symbol}`,
  };
}