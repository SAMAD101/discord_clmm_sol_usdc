# discord_clmm_sol_usdc

Discord Bot for Liquidity management in the SOL-USDC CLMM pool on Raydium.

## Setup

1. Clone the repository

```bash
git clone https://github.com/asamadans/discord_clmm_sol_usdc.git
```

2. Install dependencies

```bash
yarn install
```

3. Create a `.env` file in the root of the project and add the following variables:

```
# database
DATABASE_USER=
DATABASE_PASSWORK=
DATABASE_NAME=
DATABASE_URL=

# solana
RPC_ENDPOINT=

# redis
REDIS_HOST=
REDIS_PORT=

# discord
BOT_CLIENT_ID=
DISCORD_TOKEN=
DISCORD_CHANNEL_WEBHOOK=

WALLET_SECRET_KEY=
```
3. Run the docker containers

```bash
docker compose up -d
```

4. Run the bot

```bash
yarn run dev
```
