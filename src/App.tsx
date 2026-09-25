import { useState } from 'react';
import { Search, TrendingUp, Shield, BookOpen, Briefcase, Calculator, Settings } from 'lucide-react';
import { CompositeProvider } from './providers/CompositeProvider';
import { analyseCompany } from './analysis/orchestrator';
import { CompanyData } from './types/company';
import { FullAnalysis } from './types/analysis';
import { Dashboard } from './components/dashboard/Dashboard';
import { ManualInput } from './components/dashboard/ManualInput';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { hasLiveKey } from './utils/storage';

const provider = new CompositeProvider();

export default function App() {
  const [query, setQuery] = useState('');
  const [market, setMarket] = useState('Auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [liveEnabled, setLiveEnabled] = useState(() => hasLiveKey());

  const handleAnalyse = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setCompany(null);
    setAnalysis(null);
    try {
      const data = await provider.fetchCompany(query.trim(), market === 'Auto' ? undefined : market);
      if (!data) {
        setError(
          `No data for "${query}". Try a demo ticker, connect a free Finnhub key (Settings) for US stocks, or use Manual Input.`
        );
        return;
      }
      const result = analyseCompany(data);
      setCompany(data);
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (data: CompanyData) => {
    setShowManual(false);
    setCompany(data);
    setAnalysis(analyseCompany(data));
    setError(null);
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <header className="border-b border-navy-700 bg-navy-800/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-navy-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">StockWise AI</h1>
              <p className="text-xs text-slate-400">Free Research • Transparent • Zero Cost</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {liveEnabled && (
              <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live key active
              </span>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-navy-700 text-slate-300"
              title="Live data settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!company && (
          <section className="text-center py-10 sm:py-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Analyse Any Stock</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Demo data for NGX & popular US names. Optional near-realtime (delayed) US quotes via your free Finnhub key.
            </p>

            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyse()}
                  placeholder="Ticker e.g. AAPL, MSFT, GTCO"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-800 border border-navy-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>
              <select
                value={market}
                onChange={e => setMarket(e.target.value)}
                className="px-4 py-3 rounded-xl bg-navy-800 border border-navy-600 text-slate-200"
              >
                <option value="Auto">Auto Detect</option>
                <option value="NGX">NGX</option>
                <option value="US">US</option>
              </select>
              <button
                onClick={handleAnalyse}
                disabled={loading || !query.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-navy-900 font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Analysing…' : 'ANALYSE STOCK'}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setShowManual(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 text-sm"
              >
                <Calculator className="w-4 h-4" /> Manual Input
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-navy-600 text-slate-300 hover:bg-navy-800 text-sm"
              >
                <Settings className="w-4 h-4" /> Connect free live key
              </button>
            </div>

            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-2">NGX demo</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm mb-4">
                {['GTCO', 'ZENITHBANK', 'ACCESS', 'UBA', 'DANGCEM', 'MTNN', 'BUACEMENT', 'NESTLE', 'SEPLAT'].map(t => (
                  <button key={t} onClick={() => setQuery(t)}
                    className="px-3 py-1 rounded-full bg-navy-800 border border-navy-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300">
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mb-2">US (demo or live with key)</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL', 'AMZN'].map(t => (
                  <button key={t} onClick={() => setQuery(t)}
                    className="px-3 py-1 rounded-full bg-navy-800 border border-navy-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-6 max-w-xl mx-auto p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
              <div className="p-5 rounded-xl bg-navy-800/60 border border-navy-700">
                <TrendingUp className="w-6 h-6 text-cyan-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Multi-Engine Analysis</h3>
                <p className="text-sm text-slate-400">Fundamentals, valuation, technicals, risk and transparent decision scores.</p>
              </div>
              <div className="p-5 rounded-xl bg-navy-800/60 border border-navy-700">
                <Shield className="w-6 h-6 text-teal-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Zero Mandatory Cost</h3>
                <p className="text-sm text-slate-400">Demo + Manual free. Optional live key stays in your browser only.</p>
              </div>
              <div className="p-5 rounded-xl bg-navy-800/60 border border-navy-700">
                <Briefcase className="w-6 h-6 text-amber-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">NGX + Global</h3>
                <p className="text-sm text-slate-400">Demo for Nigerian names; near-realtime US with free Finnhub key.</p>
              </div>
            </div>
          </section>
        )}

        {company && analysis && (
          <Dashboard
            company={company}
            analysis={analysis}
            onBack={() => { setCompany(null); setAnalysis(null); setQuery(''); }}
          />
        )}
      </main>

      <footer className="border-t border-navy-700 mt-16 py-8 text-center text-xs text-slate-500">
        <p>StockWise AI is a research tool. It does not provide personalised investment advice.</p>
        <p className="mt-1">Live free-tier data is typically delayed. Demo and model outputs are not guarantees.</p>
        <p className="mt-2">© 2026 StockWise AI — Open Source • GitHub Pages</p>
      </footer>

      {showManual && (
        <ManualInput onSubmit={handleManualSubmit} onCancel={() => setShowManual(false)} />
      )}
      {showSettings && (
        <SettingsPanel
          onClose={() => {
            setShowSettings(false);
            setLiveEnabled(hasLiveKey());
          }}
        />
      )}
    </div>
  );
}
