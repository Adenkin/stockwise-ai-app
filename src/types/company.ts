export type DataStatus = 'Actual' | 'Calculated' | 'Estimated' | 'Historical' | 'Demo' | 'Unavailable' | 'User';

export interface DataPoint<T = number> {
  value: T | null;
  status: DataStatus;
  source?: string;
  asOf?: string;
  currency?: string;
  notes?: string;
}

export interface CompanyProfile {
  name: string;
  ticker: string;
  exchange: string;
  country: string;
  sector: string;
  industry: string;
  currency: string;
  marketCap?: DataPoint;
  sharePrice?: DataPoint;
  week52High?: DataPoint;
  week52Low?: DataPoint;
  sharesOutstanding?: DataPoint;
  description?: string;
  isDemo?: boolean;
}

export interface Financials {
  // Income
  revenue: DataPoint[];
  netIncome: DataPoint[];
  eps: DataPoint[];
  grossMargin?: DataPoint;
  operatingMargin?: DataPoint;
  netMargin?: DataPoint;
  // Balance
  totalAssets?: DataPoint;
  totalLiabilities?: DataPoint;
  equity?: DataPoint;
  cash?: DataPoint;
  totalDebt?: DataPoint;
  currentAssets?: DataPoint;
  currentLiabilities?: DataPoint;
  // Cash flow
  operatingCashFlow?: DataPoint[];
  freeCashFlow?: DataPoint[];
  capex?: DataPoint[];
  // Ratios
  pe?: DataPoint;
  pb?: DataPoint;
  ps?: DataPoint;
  evEbitda?: DataPoint;
  roe?: DataPoint;
  roa?: DataPoint;
  debtEquity?: DataPoint;
  currentRatio?: DataPoint;
  dividendYield?: DataPoint;
  dividendPerShare?: DataPoint;
  payoutRatio?: DataPoint;
}

export interface PriceBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CompanyData {
  profile: CompanyProfile;
  financials: Financials;
  prices: PriceBar[];
  lastUpdated: string;
  dataCompleteness: number; // 0-100
  sources: { name: string; retrievedAt: string; period?: string }[];
}
