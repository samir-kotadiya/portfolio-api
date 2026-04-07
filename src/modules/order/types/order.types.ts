export type OrderType = "BUY" | "SELL";

export interface PortfolioStock {
  symbol: string;
  weight: number;
  price?: number;
}