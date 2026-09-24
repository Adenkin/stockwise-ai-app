import { CompanyData } from '../types/company';
import { DecisionResult, ScoreBreakdown, Classification } from '../types/analysis';
import { cagr, growthRate, marginOfSafety, average } from '../utils/math';

const DEFAULT_WEIGHTS = {
  financialStrength: 0.15,
  earningsGrowth: 0.15,
  profitability: 0.10,
  cashFlow: 0.10,
  valuation: 0.20,
  dividendQuality: 0.05,
  technicalTrend: 0.10,
  balanceSheet: 0.05,
  industryPosition: 0.05,
  risk: 0.05,
};

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

export function runDecisionEngine(
  data: CompanyData,
  technicalTrendScore = 50,
  riskScore = 50
): DecisionResult {
  const f = data.financials;
  const prices = data.prices;
  const currentPrice = data.profile.sharePrice?.value ?? (prices.length ? prices[prices.length - 1].close : null);

  // --- Component scores (0-100) ---
  let financialStrength = 50;
  if (f.roe?.value != null) financialStrength += Math.min(30, f.roe.value * 100);
  if (f.currentRatio?.value != null) financialStrength += f.currentRatio.value > 1.2 ? 10 : f.currentRatio.value > 0.8 ? 5 : -10;
  financialStrength = clamp(financialStrength);

  let earningsGrowth = 40;
  const epsArr = (f.eps || []).map(e => e.value).filter((v): v is number => v != null);
  if (epsArr.length >= 2) {
    const g = growthRate(epsArr[epsArr.length - 1], epsArr[0]);
    if (g != null) earningsGrowth = clamp(50 + g * 200);
  }
  earningsGrowth = clamp(earningsGrowth);

  let profitability = 40;
  if (f.netMargin?.value != null) profitability += Math.min(40, f.netMargin.value * 150);
  if (f.roe?.value != null) profitability += Math.min(20, f.roe.value * 50);
  profitability = clamp(profitability);

  let cashFlow = 50; // limited data in demo
  let valuation = 50;
  if (f.pe?.value != null) {
    if (f.pe.value < 10) valuation = 80;
    else if (f.pe.value < 20) valuation = 65;
    else if (f.pe.value < 35) valuation = 45;
    else valuation = 25;
  }
  if (f.pb?.value != null && f.pb.value < 1.5) valuation = Math.min(100, valuation + 15);

  let dividendQuality = 40;
  if (f.dividendYield?.value != null) {
    dividendQuality = clamp(30 + f.dividendYield.value * 400);
    if (f.payoutRatio?.value != null && f.payoutRatio.value > 0.8) dividendQuality -= 20;
  }

  let balanceSheet = 50;
  if (f.debtEquity?.value != null) {
    if (f.debtEquity.value < 0.5) balanceSheet = 80;
    else if (f.debtEquity.value < 1.0) balanceSheet = 60;
    else if (f.debtEquity.value < 2.0) balanceSheet = 40;
    else balanceSheet = 20;
  }

  const scores: ScoreBreakdown = {
    financialStrength,
    earningsGrowth,
    profitability,
    cashFlow,
    valuation,
    dividendQuality,
    technicalTrend: technicalTrendScore,
    balanceSheet,
    industryPosition: 55, // neutral without more data
    risk: riskScore,
    overall: 0,
  };

  // Weighted overall
  let overall = 0;
  for (const [k, w] of Object.entries(DEFAULT_WEIGHTS)) {
    overall += (scores as any)[k] * w;
  }
  scores.overall = clamp(overall);

  // Classification
  let classification: Classification = 'WATCH';
  if (scores.overall >= 72 && data.dataCompleteness >= 60) classification = 'BUY';
  else if (scores.overall >= 55) classification = 'WATCH';
  else if (scores.overall >= 40) classification = 'HOLD';
  else classification = 'AVOID-HIGH-RISK';

  // Evidence quality
  let evidenceQuality: 'High' | 'Moderate' | 'Limited' = 'Limited';
  if (data.dataCompleteness >= 80) evidenceQuality = 'High';
  else if (data.dataCompleteness >= 55) evidenceQuality = 'Moderate';

  // Reasons & concerns (transparent)
  const reasons: string[] = [];
  const concerns: string[] = [];
  const whatWouldChange: string[] = [];

  if (scores.valuation >= 65) reasons.push(`Attractive valuation metrics (P/E ${f.pe?.value?.toFixed(1) ?? 'n/a'})`);
  if (scores.earningsGrowth >= 60) reasons.push('Positive earnings growth trajectory');
  if (scores.profitability >= 60) reasons.push('Healthy profitability margins / ROE');
  if (scores.financialStrength >= 60) reasons.push('Solid financial strength indicators');
  if (f.dividendYield?.value && f.dividendYield.value > 0.05) reasons.push(`Meaningful dividend yield (${(f.dividendYield.value * 100).toFixed(1)}%)`);

  if (scores.valuation < 40) concerns.push('Elevated valuation multiples relative to peers/history');
  if (scores.earningsGrowth < 40) concerns.push('Weak or negative earnings growth');
  if (f.debtEquity?.value && f.debtEquity.value > 1.5) concerns.push('Elevated leverage');
  if (data.profile.isDemo) concerns.push('Analysis based on DEMO data — verify with official filings');
  if (data.dataCompleteness < 60) concerns.push('Limited data completeness reduces confidence');

  whatWouldChange.push('Material improvement or deterioration in earnings growth');
  whatWouldChange.push('Significant change in valuation (price move or multiple expansion/contraction)');
  whatWouldChange.push('Update from official financial statements / audited results');
  whatWouldChange.push('Clearer technical trend confirmation');

  if (reasons.length === 0) reasons.push('Mixed signals across scored factors — monitor for clearer direction');

  return {
    classification,
    overallScore: Math.round(scores.overall),
    scores,
    evidenceQuality,
    reasons,
    concerns,
    whatWouldChange,
    dataCompleteness: data.dataCompleteness,
  };
}
