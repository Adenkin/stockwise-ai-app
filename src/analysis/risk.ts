import { CompanyData } from '../types/company';
import { RiskItem } from '../types/analysis';

export function runRiskEngine(data: CompanyData): RiskItem[] {
  const risks: RiskItem[] = [];
  const f = data.financials;
  const isBank = data.profile.industry?.toLowerCase().includes('bank');

  if (data.profile.isDemo) {
    risks.push({
      category: 'Data Quality',
      severity: 'High',
      evidence: 'Using demo dataset',
      explanation: 'Results are illustrative only. Do not use for real investment decisions without verifying against official company filings and exchange data.',
      source: 'System',
    });
  }

  if (f.debtEquity?.value != null && f.debtEquity.value > 1.5) {
    risks.push({
      category: 'Financial Risk',
      severity: f.debtEquity.value > 2.5 ? 'High' : 'Medium',
      evidence: `Debt/Equity = ${f.debtEquity.value.toFixed(2)}`,
      explanation: 'Elevated leverage can amplify losses in downturns and increase refinancing risk.',
      source: 'Calculated from available data',
    });
  }

  if (f.pe?.value != null && f.pe.value > 40) {
    risks.push({
      category: 'Valuation Risk',
      severity: 'Medium',
      evidence: `P/E = ${f.pe.value.toFixed(1)}`,
      explanation: 'High multiple leaves limited margin of safety if growth disappoints.',
      source: 'Market data',
    });
  }

  if (data.profile.country === 'Nigeria') {
    risks.push({
      category: 'FX / Macro Risk',
      severity: 'Medium',
      evidence: 'Nigerian listed equity',
      explanation: 'Exposure to naira volatility, inflation, interest-rate and policy changes. Verify latest CBN/NBS data.',
      source: 'Market context',
    });
  }

  if (isBank) {
    risks.push({
      category: 'Business Risk',
      severity: 'Medium',
      evidence: 'Banking sector',
      explanation: 'Banks face credit risk, interest-rate risk, regulatory capital requirements and asset-quality cycles. Standard industrial ratios are less applicable.',
      source: 'Sector knowledge',
    });
  }

  if (f.currentRatio?.value != null && f.currentRatio.value < 1.0) {
    risks.push({
      category: 'Liquidity Risk',
      severity: 'Medium',
      evidence: `Current ratio = ${f.currentRatio.value.toFixed(2)}`,
      explanation: 'Current liabilities exceed current assets — monitor working capital closely.',
      source: 'Calculated',
    });
  }

  if (risks.length === 0) {
    risks.push({
      category: 'General',
      severity: 'Low',
      evidence: 'No major red flags in available data',
      explanation: 'Continue monitoring earnings, debt and sector developments.',
      source: 'System',
    });
  }

  return risks;
}

export function riskScoreFromItems(items: RiskItem[]): number {
  let penalty = 0;
  for (const r of items) {
    if (r.severity === 'High') penalty += 25;
    else if (r.severity === 'Medium') penalty += 12;
    else penalty += 3;
  }
  return Math.max(0, 100 - penalty);
}
