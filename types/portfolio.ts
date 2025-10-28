export interface Stock {
  id: string;
  symbol: string;
  company: string;
  sector: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketCap: string;
  peRatio: number;
  dividend: number;
  beta: number;
  dayChange: number;
  dayChangePercent: number;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  weight: number;
}

export interface SectorSummary {
  sector: string;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  stockCount: number;
  weight: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}