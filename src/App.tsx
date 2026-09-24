import { useState } from 'react';
import { Search, TrendingUp, Shield, BookOpen, Briefcase } from 'lucide-react';
import { DemoProvider } from './providers/DemoProvider';
import { analyseCompany } from './analysis/orchestrator';
import { CompanyData } from './types/company';
import { FullAnalysis } from './types/analysis';
import { Dashboard } from './components/dashboard/Dashboard';
import { formatPct, formatNumber } from './utils/math';

const provider = new DemoProvider();

export default function App() {
  const [query, setQuery] = useState('');
  const [market, setMarket] = useState('Auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);

  const handleAnalyse = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setCompany(null);
    setAnalysis(null);
    try {
      const data = await provider.fetchCompany(query.trim(), market === 'Auto' ? undefined : market);
      if (!data) {
        setError(`No data found for "${query}". Try GTCO, ZENITHBANK, AAPL or MSFT (demo mode).`);
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

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header */}
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
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Local only</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Open Source</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Hero */}
        {!company && (
          <section className="text-center py-12 sm:py-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Analyse Any Stock
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Professional-grade fundamental, valuation, technical and risk analysis.
              Currently powered by transparent demo data for NGX & US examples.
            </p>

            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyse()}
                  placeholder="Enter ticker e.g. GTCO, AAPL, MSFT"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-800 border border-navy-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                />
              </div>
              <select
                value={market}
                onChange={e => setMarket(e.target.value)}
                className="px-4 py-3 rounded-xl bg-navy-800 border border-navy-600 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <option value="Auto">Auto Detect</option>
                <option value="NGX">NGX</option>
                <option value="US">US</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
              <button
                onClick={handleAnalyse}
                disabled={loading || !query.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-navy-900 font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? 'Analysing…' : 'ANALYSE STOCK'}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
              {['GTCO', 'ZENITHBANK', 'AAPL', 'MSFT'].map(t => (
                <button
                  key={t}
                  onClick={() => { setQuery(t); }}
                  className="px-3 py-1 rounded-full bg-navy-800 border border-navy-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300 transition"
                >
                  {t}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-6 max-w-xl mx-auto p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
              <div className="p-5 rounded-xl bg-navy-800/60 border border-navy-700">
                <TrendingUp className="w-6 h-6 text-cyan-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Multi-Engine Analysis</h3>
                <p className="text-sm text-slate-400">Fundamentals, valuation, technicals, risk and transparent decision scores.</p>
              </div>
              <div className="p-5 rounded-xl bg-navy-800/60 border border-navy-700">
                <Shield className="w-6 h-6 text-teal-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Zero Mandatory Cost</h3>
                <p className="text-sm text-slate-400">Runs entirely in your browser. No paid APIs required for core analysis.</p>
              </div>
              <div className="p-5 rounded-xl bg-navy-800/60 border border-navy-700">
                <Briefcase className="w-6 h-6 text-amber-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">NGX + Global</h3>
                <p className="text-sm text-slate-400">Designed for Nigerian listed stocks and major international markets.</p>
              </div>
            </div>
          </section>
        )}

        {/* Results */}
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
        <p className="mt-1">All classifications are model outputs based on available data and transparent rules. You make the final decision.</p>
        <p className="mt-2">© 2026 StockWise AI — Open Source • GitHub Pages</p>
      </footer>
    </div>
  );
}
