import {
  Raydium,
  TxVersion,
  parseTokenAccountResp,
} from "@raydium-io/raydium-sdk-v2";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const rpcEndpoint = process.env.RPC_ENDPOINT!;

const secretKey = new Uint8Array(JSON.parse(process.env.WALLET_SECRET_KEY!));

export const owner: Keypair = Keypair.fromSecretKey(
  secretKey,
);

export const ownerPublicKey = owner.publicKey.toBase58();

export const connection = new Connection(rpcEndpoint, {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000,
  wsEndpoint: rpcEndpoint.replace("https", "wss"),
});

export const txVersion = TxVersion.V0;
const cluster = "mainnet";

let raydium: Raydium | undefined;

export const initSdk = async (params?: { loadToken?: boolean }) => {
  if (raydium) return raydium;
  console.log(`connect to rpc ${connection.rpcEndpoint} in ${cluster}`);
  raydium = await Raydium.load({
    owner,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: "finalized",
  });

  return raydium;
};

export const fetchTokenAccountData = async () => {
  const solAccountResp = await connection.getAccountInfo(owner.publicKey);
  const tokenAccountResp = await connection.getTokenAccountsByOwner(
    owner.publicKey,
    { programId: TOKEN_PROGRAM_ID },
  );
  const token2022Req = await connection.getTokenAccountsByOwner(
    owner.publicKey,
    { programId: TOKEN_2022_PROGRAM_ID },
  );
  const tokenAccountData = parseTokenAccountResp({
    owner: owner.publicKey,
    solAccountResp,
    tokenAccountResp: {
      context: tokenAccountResp.context,
      value: [...tokenAccountResp.value, ...token2022Req.value],
    },
  });
  return tokenAccountData;
};

