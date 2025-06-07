import {
    getPdaLockClPositionIdV2,
    CLMM_LOCK_PROGRAM_ID,
    LockClPositionLayoutV2,
} from '@raydium-io/raydium-sdk-v2'
import { PublicKey } from '@solana/web3.js'
import { initSdk, txVersion } from './raydium_config'

export const harvest_locked_position = async (lockNftMint: string) => {
    const raydium = await initSdk({ loadToken: true })

    const lockPositionId = getPdaLockClPositionIdV2(CLMM_LOCK_PROGRAM_ID, new PublicKey(lockNftMint)).publicKey
    const res = await raydium.connection.getAccountInfo(lockPositionId)
    const lockData = LockClPositionLayoutV2.decode(res!.data)

    const { execute, transaction } = await raydium.clmm.harvestLockPosition({
        lockData,
        txVersion,
    })

    const { txId } = await execute({ sendAndConfirm: true })
    console.log('harvested locked position :', { txId: `https://explorer.solana.com/tx/${txId}` })
}