export type Position = {
  id: string;
  amount: number;
  pool: string;
};

export type PositionWithPool = Position & {
  pooledAmountA: number;
  pooledAmountB: number;
}
