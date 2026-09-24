import { DataProvider, loadDemoData } from './DataProvider';
import { CompanyData, DataPoint } from '../types/company';

function toDP(v: any): DataPoint {
  if (v == null) return { value: null, status: 'Unavailable' };
  if (typeof v === 'object' && 'value' in v) return v as DataPoint;
  return { value: v, status: 'Demo' };
}

export class DemoProvider implements DataProvider {
  name = 'DemoProvider';
  private cache: Record<string, any> | null = null;

  canHandle(_ticker: string, _market?: string) {
    return true; // always fallback
  }

  async fetchCompany(ticker: string, _market?: string): Promise<CompanyData | null> {
    if (!this.cache) this.cache = await loadDemoData();
    const key = ticker.toUpperCase().replace(/\.NG$/, '').replace(/\.NGX$/, '');
    const raw = this.cache[key];
    if (!raw) return null;

    const f = raw.financials || {};
    const profile = {
      ...raw.profile,
      sharePrice: toDP(f.sharePrice),
      marketCap: toDP(f.marketCap),
      isDemo: true,
    };

    // Generate simple synthetic prices for demo charts
    const prices = [];
    const base = profile.sharePrice?.value || 100;
    const now = new Date();
    for (let i = 120; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const noise = 1 + (Math.sin(i / 10) * 0.05) + (Math.random() - 0.5) * 0.03;
      const close = base * noise;
      prices.push({
        date: d.toISOString().slice(0, 10),
        open: close * 0.99,
        high: close * 1.02,
        low: close * 0.98,
        close,
        volume: Math.floor(1e6 + Math.random() * 5e6),
      });
    }

    return {
      profile,
      financials: {
        revenue: (f.revenue || []).map(toDP),
        netIncome: (f.netIncome || []).map(toDP),
        eps: (f.eps || []).map(toDP),
        pe: toDP(f.pe),
        pb: toDP(f.pb),
        roe: toDP(f.roe),
        roa: toDP(f.roa),
        debtEquity: toDP(f.debtEquity),
        currentRatio: toDP(f.currentRatio),
        dividendYield: toDP(f.dividendYield),
        dividendPerShare: toDP(f.dividendPerShare),
        payoutRatio: toDP(f.payoutRatio),
        netMargin: toDP(f.netMargin),
        marketCap: toDP(f.marketCap),
      },
      prices,
      lastUpdated: new Date().toISOString(),
      dataCompleteness: 75,
      sources: [{ name: 'Demo Dataset', retrievedAt: new Date().toISOString(), period: 'Static demo' }],
    };
  }
}
