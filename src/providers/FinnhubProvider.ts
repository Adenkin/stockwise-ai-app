import { DataProvider } from './DataProvider';
import { CompanyData, DataPoint, PriceBar } from '../types/company';
import { getApiKey } from '../utils/storage';

function dp(v: number | null | undefined, status: DataPoint['status'] = 'Actual'): DataPoint {
  if (v == null || isNaN(v as number)) return { value: null, status: 'Unavailable' };
  return { value: v, status, source: 'Finnhub (delayed free tier)' };
}

export class FinnhubProvider implements DataProvider {
  name = 'FinnhubProvider';

  canHandle(ticker: string, market?: string): boolean {
    const t = ticker.toUpperCase();
    if (market === 'NGX') return false;
    const ngxList = ['GTCO', 'ZENITHBANK', 'ACCESS', 'UBA', 'DANGCEM', 'MTNN', 'BUACEMENT', 'NESTLE', 'SEPLAT'];
    if (ngxList.includes(t)) return false;
    return !!getApiKey('finnhub');
  }

  async fetchCompany(ticker: string, _market?: string): Promise<CompanyData | null> {
    const token = getApiKey('finnhub');
    if (!token) return null;

    const symbol = ticker.toUpperCase().trim();
    try {
      const [quoteRes, profileRes, metricRes, candleRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${token}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${token}`),
        fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${token}`),
        fetch(this.candleUrl(symbol, token)),
      ]);

      if (!quoteRes.ok) return null;
      const quote = await quoteRes.json();
      if (quote.c == null || quote.c === 0) return null;

      const profile = profileRes.ok ? await profileRes.json() : {};
      const metricBody = metricRes.ok ? await metricRes.json() : {};
      const metrics = metricBody.metric || {};

      let prices: PriceBar[] = [];
      if (candleRes.ok) {
        const candle = await candleRes.json();
        if (candle.s === 'ok' && Array.isArray(candle.t)) {
          prices = candle.t.map((ts: number, i: number) => ({
            date: new Date(ts * 1000).toISOString().slice(0, 10),
            open: candle.o[i],
            high: candle.h[i],
            low: candle.l[i],
            close: candle.c[i],
            volume: candle.v[i] || 0,
          }));
        }
      }

      const pe = metrics.peNormalizedAnnual ?? metrics.peTTM ?? metrics.peAnnual ?? null;
      const pb = metrics.pbAnnual ?? metrics.pb ?? null;
      const roe = metrics.roeTTM ?? metrics.roeRfy ?? null;
      const roa = metrics.roaTTM ?? metrics.roaRfy ?? null;
      const netMargin = metrics.netProfitMarginTTM ?? metrics.netMarginTTM ?? null;
      const divYield =
        metrics.dividendYieldIndicatedAnnual != null
          ? metrics.dividendYieldIndicatedAnnual / 100
          : null;

      const roeVal = roe != null ? (Math.abs(roe) > 1 ? roe / 100 : roe) : null;
      const roaVal = roa != null ? (Math.abs(roa) > 1 ? roa / 100 : roa) : null;
      const marginVal = netMargin != null ? (Math.abs(netMargin) > 1 ? netMargin / 100 : netMargin) : null;

      return {
        profile: {
          name: profile.name || symbol,
          ticker: symbol,
          exchange: profile.exchange || 'US',
          country: profile.country || 'United States',
          sector: profile.finnhubIndustry || 'Unknown',
          industry: profile.finnhubIndustry || 'Unknown',
          currency: profile.currency || 'USD',
          sharePrice: dp(quote.c, 'Actual'),
          marketCap: dp(profile.marketCapitalization != null ? profile.marketCapitalization * 1e6 : null, 'Actual'),
          description: `${profile.name || symbol} — live data via Finnhub free tier (typically delayed). Not investment advice.`,
          isDemo: false,
        },
        financials: {
          revenue: [],
          netIncome: [],
          eps:
            metrics.epsAnnual != null || metrics.epsTTM != null
              ? [{ value: metrics.epsTTM ?? metrics.epsAnnual, status: 'Actual', source: 'Finnhub' }]
              : [],
          pe: dp(pe, 'Actual'),
          pb: dp(pb, 'Actual'),
          roe: dp(roeVal, 'Actual'),
          roa: dp(roaVal, 'Actual'),
          netMargin: dp(marginVal, 'Actual'),
          debtEquity: dp(metrics['totalDebt/totalEquityAnnual'] ?? metrics.totalDebtToEquity, 'Actual'),
          currentRatio: dp(metrics.currentRatioAnnual ?? metrics.currentRatio, 'Actual'),
          dividendYield: dp(typeof divYield === 'number' ? divYield : null, 'Actual'),
          dividendPerShare: dp(metrics.dividendPerShareAnnual, 'Actual'),
          marketCap: dp(profile.marketCapitalization != null ? profile.marketCapitalization * 1e6 : null, 'Actual'),
        },
        prices,
        lastUpdated: new Date().toISOString(),
        dataCompleteness: prices.length > 50 ? 80 : 65,
        sources: [
          {
            name: 'Finnhub free API (delayed quotes)',
            retrievedAt: new Date().toISOString(),
            period: 'Near-realtime / delayed free tier',
          },
        ],
      };
    } catch (e) {
      console.warn('Finnhub fetch failed', e);
      return null;
    }
  }

  private candleUrl(symbol: string, token: string): string {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 365 * 24 * 3600;
    return `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${to}&token=${token}`;
  }
}
