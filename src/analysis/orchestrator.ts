import { CompanyData } from '../types/company';
import { FullAnalysis } from '../types/analysis';
import { runDecisionEngine } from './decision';
import { runTechnicalAnalysis, technicalScore } from './technical';
import { runValuation } from './valuation';
import { runRiskEngine, riskScoreFromItems } from './risk';

export function analyseCompany(data: CompanyData): FullAnalysis {
  const technical = runTechnicalAnalysis(data.prices);
  const techScore = technicalScore(technical);
  const risks = runRiskEngine(data);
  const riskScore = riskScoreFromItems(risks);
  const valuation = runValuation(data);
  const decision = runDecisionEngine(data, techScore, riskScore);

  const fundamentalsSummary: string[] = [];
  const f = data.financials;
  if (f.roe?.value != null) fundamentalsSummary.push(`ROE: ${(f.roe.value * 100).toFixed(1)}%`);
  if (f.pe?.value != null) fundamentalsSummary.push(`P/E: ${f.pe.value.toFixed(1)}`);
  if (f.dividendYield?.value != null) fundamentalsSummary.push(`Div Yield: ${(f.dividendYield.value * 100).toFixed(1)}%`);
  if (f.netMargin?.value != null) fundamentalsSummary.push(`Net Margin: ${(f.netMargin.value * 100).toFixed(1)}%`);

  return {
    decision,
    valuation,
    technical,
    risks,
    fundamentalsSummary,
    lastAnalysed: new Date().toISOString(),
  };
}
