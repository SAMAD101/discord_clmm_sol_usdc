import { ApiV3PoolInfoConcentratedItem, ClmmKeys } from '@raydium-io/raydium-sdk-v2'
import { initSdk, txVersion } from './raydium_config'
import { isValidClmm } from './clmm_config'
import { poolId, Position } from '.'
import { positionsTable } from '../db/schema'
import { db } from '../db'
import { eq } from 'drizzle-orm'

export const close_position = async (positionId: string): Promise<Position> => {
  const raydium = await initSdk()
  let poolInfo: ApiV3PoolInfoConcentratedItem
  let poolKeys: ClmmKeys | undefined

  if (raydium.cluster === 'mainnet') {
    // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
    // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
    const data = await raydium.api.fetchPoolById({ ids: poolId })
    poolInfo = data[0] as ApiV3PoolInfoConcentratedItem
    if (!isValidClmm(poolInfo.programId)) throw new Error('target pool is not CLMM pool')
  } else {
    const data = await raydium.clmm.getPoolInfoFromRpc(poolId)
    poolInfo = data.poolInfo
    poolKeys = data.poolKeys
  }

  /** code below will get on chain realtime price to avoid slippage error, uncomment it if necessary */
  // const rpcData = await raydium.clmm.getRpcClmmPoolInfo({ poolId: poolInfo.id })
  // poolInfo.price = rpcData.currentPrice

  const allPosition = await raydium.clmm.getOwnerPositionInfo({ programId: poolInfo.programId })
  if (!allPosition.length) throw new Error('user do not have any positions')

  const position = allPosition.find((p) => p.poolId.toBase58() === poolInfo.id)
  if (!position) throw new Error(`user do not have position in pool: ${poolInfo.id}`)

  const { execute } = await raydium.clmm.closePosition({
    poolInfo,
    poolKeys,
    ownerPosition: position,
    txVersion,
    // optional: add transfer sol to tip account instruction. e.g sent tip to jito
    // txTipConfig: {
    //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
    //   amount: new BN(10000000), // 0.01 sol
    // },
  })

  // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
  const { txId } = await execute({ sendAndConfirm: true })
  console.log('clmm position closed:', { txId: `https://explorer.solana.com/tx/${txId}` })

  await db.update(positionsTable).set({
    status: "closed",
    updatedAt: new Date(),
  }).where(eq(positionsTable.id, positionId));

  return {
    id: position.nftMint.toBase58(),
    amount: Number(await db.select().from(positionsTable).where(eq(positionsTable.id, positionId)).then((res) => res[0].amount)),
    pool: `${poolInfo.mintA.symbol} - ${poolInfo.mintB.symbol}`,
  };
}