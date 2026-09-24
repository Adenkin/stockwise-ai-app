import { DataPoint } from './company';

export type Classification = 'BUY' | 'WATCH' | 'HOLD' | 'AVOID-HIGH-RISK';

export interface ScoreBreakdown {
  financialStrength: number;
  earningsGrowth: number;
  profitability: number;
  cashFlow: number;
  valuation: number;
  dividendQuality: number;
  technicalTrend: number;
  balanceSheet: number;
  industryPosition: number;
  risk: number;
  overall: number;
}

export interface DecisionResult {
  classification: Classification;
  overallScore: number;
  scores: ScoreBreakdown;
  evidenceQuality: 'High' | 'Moderate' | 'Limited';
  reasons: string[];
  concerns: string[];
  whatWouldChange: string[];
  dataCompleteness: number;
}

export interface ValuationResult {
  currentPrice: number;
  bearValue: number | null;
  baseValue: number | null;
  bullValue: number | null;
  marginOfSafety: number | null;
  methods: {
    name: string;
    value: number | null;
    notes: string;
  }[];
  assumptions: Record<string, number | string>;
}

export interface TechnicalResult {
  trend: 'Bullish' | 'Bearish' | 'Sideways';
  rsi: number | null;
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  macdSignal: string;
  overbought: boolean;
  oversold: boolean;
  support: number | null;
  resistance: number | null;
  summary: string;
}

export interface RiskItem {
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  evidence: string;
  explanation: string;
  source: string;
}

export interface FullAnalysis {
  decision: DecisionResult;
  valuation: ValuationResult;
  technical: TechnicalResult;
  risks: RiskItem[];
  fundamentalsSummary: string[];
  lastAnalysed: string;
}
