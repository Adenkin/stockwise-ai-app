import { useState } from 'react';
import { CompanyData, DataPoint } from '../../types/company';
import { X, Calculator } from 'lucide-react';

interface Props {
  onSubmit: (data: CompanyData) => void;
  onCancel: () => void;
}

function num(v: string): number | null {
  if (!v.trim()) return null;
  const n = parseFloat(v.replace(/,/g, ''));
  return isNaN(n) ? null : n;
}

function dp(v: number | null): DataPoint {
  return { value: v, status: v != null ? 'User' : 'Unavailable' };
}

export function ManualInput({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: '',
    ticker: '',
    exchange: 'NGX',
    country: 'Nigeria',
    sector: '',
    industry: '',
    currency: 'NGN',
    sharePrice: '',
    marketCap: '',
    pe: '',
    pb: '',
    roe: '',
    roa: '',
    netMargin: '',
    debtEquity: '',
    currentRatio: '',
    dividendYield: '',
    dividendPerShare: '',
    epsCurrent: '',
    epsPrior: '',
    revenueCurrent: '',
    revenuePrior: '',
    netIncomeCurrent: '',
    netIncomePrior: '',
  });

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ticker.trim() || !form.name.trim()) return;

    const price = num(form.sharePrice);
    const epsC = num(form.epsCurrent);
    const epsP = num(form.epsPrior);
    const revC = num(form.revenueCurrent);
    const revP = num(form.revenuePrior);
    const niC = num(form.netIncomeCurrent);
    const niP = num(form.netIncomePrior);

    // Synthetic prices for technical chart
    const prices = [];
    const base = price || 100;
    const now = new Date();
    for (let i = 120; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const noise = 1 + Math.sin(i / 10) * 0.04 + (Math.random() - 0.5) * 0.02;
      const close = base * noise;
      prices.push({
        date: d.toISOString().slice(0, 10),
        open: close * 0.99,
        high: close * 1.015,
        low: close * 0.985,
        close,
        volume: Math.floor(5e5 + Math.random() * 2e6),
      });
    }

    const data: CompanyData = {
      profile: {
        name: form.name.trim(),
        ticker: form.ticker.trim().toUpperCase(),
        exchange: form.exchange,
        country: form.country,
        sector: form.sector || 'Unknown',
        industry: form.industry || 'Unknown',
        currency: form.currency,
        sharePrice: dp(price),
        marketCap: dp(num(form.marketCap)),
        description: 'User-provided data. Verify against official filings.',
        isDemo: false,
      },
      financials: {
        revenue: [
          ...(revP != null ? [{ value: revP, status: 'User' as const, asOf: 'Prior' }] : []),
          ...(revC != null ? [{ value: revC, status: 'User' as const, asOf: 'Current' }] : []),
        ],
        netIncome: [
          ...(niP != null ? [{ value: niP, status: 'User' as const, asOf: 'Prior' }] : []),
          ...(niC != null ? [{ value: niC, status: 'User' as const, asOf: 'Current' }] : []),
        ],
        eps: [
          ...(epsP != null ? [{ value: epsP, status: 'User' as const, asOf: 'Prior' }] : []),
          ...(epsC != null ? [{ value: epsC, status: 'User' as const, asOf: 'Current' }] : []),
        ],
        pe: dp(num(form.pe)),
        pb: dp(num(form.pb)),
        roe: dp(num(form.roe) != null ? num(form.roe)! / 100 : null),
        roa: dp(num(form.roa) != null ? num(form.roa)! / 100 : null),
        netMargin: dp(num(form.netMargin) != null ? num(form.netMargin)! / 100 : null),
        debtEquity: dp(num(form.debtEquity)),
        currentRatio: dp(num(form.currentRatio)),
        dividendYield: dp(num(form.dividendYield) != null ? num(form.dividendYield)! / 100 : null),
        dividendPerShare: dp(num(form.dividendPerShare)),
        marketCap: dp(num(form.marketCap)),
      },
      prices,
      lastUpdated: new Date().toISOString(),
      dataCompleteness: 70,
      sources: [{ name: 'User Manual Input', retrievedAt: new Date().toISOString(), period: 'User-provided' }],
    };

    onSubmit(data);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-navy-900 border border-navy-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400";
  const labelClass = "block text-xs text-slate-400 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-navy-800 border-b border-navy-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Manual Data Entry</h2>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <p className="text-sm text-slate-400">
            Enter figures from company filings or exchange data. All values are tagged as <span className="text-cyan-300">User</span>. 
            ROE, ROA, Net Margin and Dividend Yield should be entered as percentages (e.g. 22 for 22%).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Name *</label>
              <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Guaranty Trust Holding" />
            </div>
            <div>
              <label className={labelClass}>Ticker *</label>
              <input className={inputClass} value={form.ticker} onChange={e => set('ticker', e.target.value)} required placeholder="e.g. GTCO" />
            </div>
            <div>
              <label className={labelClass}>Exchange</label>
              <select className={inputClass} value={form.exchange} onChange={e => set('exchange', e.target.value)}>
                <option value="NGX">NGX</option>
                <option value="NASDAQ">NASDAQ</option>
                <option value="NYSE">NYSE</option>
                <option value="LSE">LSE</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select className={inputClass} value={form.currency} onChange={e => set('currency', e.target.value)}>
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input className={inputClass} value={form.country} onChange={e => set('country', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Sector</label>
              <input className={inputClass} value={form.sector} onChange={e => set('sector', e.target.value)} placeholder="e.g. Financials" />
            </div>
          </div>

          <h3 className="text-sm font-medium text-cyan-400 pt-2">Key Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div><label className={labelClass}>Share Price</label><input className={inputClass} value={form.sharePrice} onChange={e => set('sharePrice', e.target.value)} placeholder="40.5" /></div>
            <div><label className={labelClass}>Market Cap</label><input className={inputClass} value={form.marketCap} onChange={e => set('marketCap', e.target.value)} placeholder="1200000000000" /></div>
            <div><label className={labelClass}>P/E</label><input className={inputClass} value={form.pe} onChange={e => set('pe', e.target.value)} placeholder="5.2" /></div>
            <div><label className={labelClass}>P/B</label><input className={inputClass} value={form.pb} onChange={e => set('pb', e.target.value)} placeholder="0.9" /></div>
            <div><label className={labelClass}>ROE (%)</label><input className={inputClass} value={form.roe} onChange={e => set('roe', e.target.value)} placeholder="22" /></div>
            <div><label className={labelClass}>ROA (%)</label><input className={inputClass} value={form.roa} onChange={e => set('roa', e.target.value)} placeholder="3.5" /></div>
            <div><label className={labelClass}>Net Margin (%)</label><input className={inputClass} value={form.netMargin} onChange={e => set('netMargin', e.target.value)} placeholder="36" /></div>
            <div><label className={labelClass}>Debt / Equity</label><input className={inputClass} value={form.debtEquity} onChange={e => set('debtEquity', e.target.value)} placeholder="0.4" /></div>
            <div><label className={labelClass}>Current Ratio</label><input className={inputClass} value={form.currentRatio} onChange={e => set('currentRatio', e.target.value)} placeholder="1.1" /></div>
            <div><label className={labelClass}>Div Yield (%)</label><input className={inputClass} value={form.dividendYield} onChange={e => set('dividendYield', e.target.value)} placeholder="8" /></div>
            <div><label className={labelClass}>DPS</label><input className={inputClass} value={form.dividendPerShare} onChange={e => set('dividendPerShare', e.target.value)} placeholder="3.2" /></div>
          </div>

          <h3 className="text-sm font-medium text-cyan-400 pt-2">Growth (optional – helps earnings growth score)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>EPS (Current)</label><input className={inputClass} value={form.epsCurrent} onChange={e => set('epsCurrent', e.target.value)} /></div>
            <div><label className={labelClass}>EPS (Prior Year)</label><input className={inputClass} value={form.epsPrior} onChange={e => set('epsPrior', e.target.value)} /></div>
            <div><label className={labelClass}>Revenue (Current)</label><input className={inputClass} value={form.revenueCurrent} onChange={e => set('revenueCurrent', e.target.value)} /></div>
            <div><label className={labelClass}>Revenue (Prior)</label><input className={inputClass} value={form.revenuePrior} onChange={e => set('revenuePrior', e.target.value)} /></div>
            <div><label className={labelClass}>Net Income (Current)</label><input className={inputClass} value={form.netIncomeCurrent} onChange={e => set('netIncomeCurrent', e.target.value)} /></div>
            <div><label className={labelClass}>Net Income (Prior)</label><input className={inputClass} value={form.netIncomePrior} onChange={e => set('netIncomePrior', e.target.value)} /></div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-navy-900 font-semibold hover:opacity-90">
              Run Analysis
            </button>
            <button type="button" onClick={onCancel} className="px-5 py-3 rounded-xl border border-navy-600 text-slate-300 hover:bg-navy-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
