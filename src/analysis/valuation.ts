import { CompanyData } from '../types/company';
import { ValuationResult } from '../types/analysis';
import { marginOfSafety } from '../utils/math';

export function runValuation(data: CompanyData): ValuationResult {
  const f = data.financials;
  const price = data.profile.sharePrice?.value ?? null;
  const eps = (f.eps || []).map(e => e.value).filter((v): v is number => v != null);
  const lastEps = eps.length ? eps[eps.length - 1] : null;
  const pe = f.pe?.value ?? null;

  const methods: ValuationResult['methods'] = [];

  // Simple earnings power value (conservative multiple)
  let baseValue: number | null = null;
  if (lastEps != null && lastEps > 0) {
    const conservativeMultiple = 12; // adjustable
    baseValue = lastEps * conservativeMultiple;
    methods.push({ name: 'Earnings Power (12x EPS)', value: baseValue, notes: 'Assumes sustainable earnings; multiple is a model assumption.' });
  }

  // Relative P/E implied
  if (lastEps != null && pe != null && pe > 0) {
    methods.push({ name: 'Current P/E Implied', value: lastEps * pe, notes: 'Circular — reflects market price.' });
  }

  // Dividend discount rough (Gordon)
  const dps = f.dividendPerShare?.value;
  if (dps != null && dps > 0) {
    const g = 0.04; // assumed growth
    const r = 0.12; // required return
    if (r > g) {
      const ddm = dps * (1 + g) / (r - g);
      methods.push({ name: 'Gordon Growth DDM', value: ddm, notes: `Assumes ${ (g*100).toFixed(0)}% perpetual growth and ${(r*100).toFixed(0)}% required return.` });
      if (baseValue == null) baseValue = ddm;
    }
  }

  // Book value rough
  // (limited without full balance sheet)

  const bearValue = baseValue != null ? baseValue * 0.7 : null;
  const bullValue = baseValue != null ? baseValue * 1.4 : null;

  let mos: number | null = null;
  if (baseValue != null && price != null) {
    mos = marginOfSafety(baseValue, price);
  }

  return {
    currentPrice: price ?? 0,
    bearValue,
    baseValue,
    bullValue,
    marginOfSafety: mos,
    methods,
    assumptions: {
      earningsMultiple: 12,
      terminalGrowth: '4%',
      requiredReturn: '12%',
      note: 'These are model assumptions, not forecasts of certainty.',
    },
  };
}
