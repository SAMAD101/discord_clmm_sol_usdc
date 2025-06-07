import {
    getPdaLockClPositionIdV2,
    CLMM_LOCK_PROGRAM_ID,
    LockClPositionLayoutV2,
} from '@raydium-io/raydium-sdk-v2'
import { PublicKey } from '@solana/web3.js'
import { initSdk, txVersion } from './raydium_config'
import { BN } from 'bn.js'

export const harvest_all_locked_positions = async () => {
    const raydium = await initSdk({ loadToken: true })

    await raydium.account.fetchWalletTokenAccounts()
    const possibleLockMints = raydium.account.tokenAccountRawInfos
        .filter((a) => a.accountInfo.amount.eq(new BN(1)) && !raydium.token.tokenMap.has(a.accountInfo.mint.toBase58()))
        .map((a) => a.accountInfo.mint)

    const possibleLockPositionId = possibleLockMints.map(
        (m) => getPdaLockClPositionIdV2(CLMM_LOCK_PROGRAM_ID, m).publicKey
    )
    const res = await raydium.connection.getMultipleAccountsInfo(possibleLockPositionId)
    const allLockPositions = res
        .map((r, idx) =>
            r
                ? {
                    ...LockClPositionLayoutV2.decode(r.data),
                    lockPositionId: possibleLockPositionId[idx],
                }
                : undefined
        )
        .filter(Boolean) as (ReturnType<typeof LockClPositionLayoutV2.decode> & { lockPositionId: PublicKey })[]
    if (!allLockPositions.length) throw new Error('you do not have any lock positions')

    for (const lockData of allLockPositions) {
        const { execute, transaction } = await raydium.clmm.harvestLockPosition({
            lockData,
            txVersion,
        })

        const { txId } = await execute({ sendAndConfirm: true })
        console.log('harvested locked position :', { txId: `https://explorer.solana.com/tx/${txId}` })
    }
}