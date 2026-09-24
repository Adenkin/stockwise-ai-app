import { CompanyData } from '../../types/company';
import { FullAnalysis } from '../../types/analysis';
import { formatPct, formatNumber, formatCurrency } from '../../utils/math';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  company: CompanyData;
  analysis: FullAnalysis;
  onBack: () => void;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-200 font-medium">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-navy-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Dashboard({ company, analysis, onBack }: Props) {
  const { profile, financials, dataCompleteness, sources, isDemo } = {
    ...company,
    isDemo: company.profile.isDemo,
  };
  const { decision, valuation, technical, risks, fundamentalsSummary } = analysis;

  const classColor =
    decision.classification === 'BUY' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
    decision.classification === 'WATCH' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
    decision.classification === 'HOLD' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
    'bg-red-500/20 text-red-300 border-red-500/40';

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to search
        </button>
        {profile.isDemo && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/40 border border-amber-600/50 text-amber-200 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            DEMO DATA — NOT FOR INVESTMENT DECISIONS
          </div>
        )}
      </div>

      {/* Company header */}
      <div className="p-6 rounded-2xl bg-navy-800 border border-navy-700">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-slate-400 mt-1">
              {profile.ticker} · {profile.exchange} · {profile.country} · {profile.sector}
            </p>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl">{profile.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {formatCurrency(profile.sharePrice?.value ?? null, profile.currency)}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Mkt Cap: {formatCurrency(financials.marketCap?.value ?? null, profile.currency, 1)}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          <div><span className="text-slate-500 block">P/E</span><span className="font-medium">{formatNumber(financials.pe?.value ?? null, 1)}</span></div>
          <div><span className="text-slate-500 block">P/B</span><span className="font-medium">{formatNumber(financials.pb?.value ?? null, 2)}</span></div>
          <div><span className="text-slate-500 block">ROE</span><span className="font-medium">{formatPct(financials.roe?.value ?? null)}</span></div>
          <div><span className="text-slate-500 block">Div Yield</span><span className="font-medium">{formatPct(financials.dividendYield?.value ?? null)}</span></div>
          <div><span className="text-slate-500 block">Debt/Equity</span><span className="font-medium">{formatNumber(financials.debtEquity?.value ?? null, 2)}</span></div>
          <div><span className="text-slate-500 block">Data Quality</span><span className="font-medium">{dataCompleteness}%</span></div>
        </div>
      </div>

      {/* Decision panel */}
      <div className="p-6 rounded-2xl bg-navy-800 border border-navy-700">
        <h3 className="text-lg font-semibold text-white mb-4">Investment Decision</h3>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`px-4 py-2 rounded-xl border font-bold text-lg ${classColor}`}>
            {decision.classification}
          </span>
          <div>
            <div className="text-2xl font-bold text-white">{decision.overallScore}<span className="text-sm text-slate-400 font-normal"> / 100</span></div>
            <div className="text-xs text-slate-400">Overall Research Score · Evidence: {decision.evidenceQuality}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Reasons supporting classification</h4>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {decision.reasons.map((r, i) => <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{r}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Key concerns</h4>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {decision.concerns.map((c, i) => <li key={i} className="flex gap-2"><span className="text-amber-500">•</span>{c}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-navy-900/60 border border-navy-600">
          <h4 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-1"><Info className="w-4 h-4" /> What would change the classification?</h4>
          <ul className="space-y-1 text-sm text-slate-400">
            {decision.whatWouldChange.map((w, i) => <li key={i}>• {w}</li>)}
          </ul>
        </div>
      </div>

      {/* Score breakdown + Valuation + Technical */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-navy-800 border border-navy-700">
          <h3 className="font-semibold text-white mb-4">Score Breakdown</h3>
          <ScoreBar label="Financial Strength" value={decision.scores.financialStrength} />
          <ScoreBar label="Earnings Growth" value={decision.scores.earningsGrowth} />
          <ScoreBar label="Profitability" value={decision.scores.profitability} />
          <ScoreBar label="Valuation" value={decision.scores.valuation} />
          <ScoreBar label="Technical Trend" value={decision.scores.technicalTrend} />
          <ScoreBar label="Balance Sheet" value={decision.scores.balanceSheet} />
          <ScoreBar label="Dividend Quality" value={decision.scores.dividendQuality} />
          <ScoreBar label="Risk (higher=better)" value={decision.scores.risk} />
        </div>

        <div className="p-5 rounded-2xl bg-navy-800 border border-navy-700">
          <h3 className="font-semibold text-white mb-4">Valuation Range</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Current Price</span><span className="font-medium">{formatNumber(valuation.currentPrice)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Bear Case</span><span className="font-medium text-red-300">{formatNumber(valuation.bearValue)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Base Case</span><span className="font-medium text-cyan-300">{formatNumber(valuation.baseValue)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Bull Case</span><span className="font-medium text-emerald-300">{formatNumber(valuation.bullValue)}</span></div>
            <div className="flex justify-between border-t border-navy-600 pt-2">
              <span className="text-slate-400">Margin of Safety</span>
              <span className={`font-medium ${valuation.marginOfSafety != null && valuation.marginOfSafety > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatPct(valuation.marginOfSafety)}
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Estimated intrinsic value range based on model assumptions. Not a guarantee.</p>
          <div className="mt-3 space-y-1">
            {valuation.methods.map((m, i) => (
              <div key={i} className="text-xs text-slate-400">
                <span className="text-slate-300">{m.name}:</span> {formatNumber(m.value)} — {m.notes}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-800 border border-navy-700">
          <h3 className="font-semibold text-white mb-4">Technical Snapshot</h3>
          <div className="flex items-center gap-2 mb-3">
            {technical.trend === 'Bullish' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> :
             technical.trend === 'Bearish' ? <TrendingDown className="w-5 h-5 text-red-400" /> :
             <span className="w-5 h-5 text-slate-400">↔</span>}
            <span className="font-medium text-lg">{technical.trend}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">RSI (14)</span><span>{formatNumber(technical.rsi, 1)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">SMA 20</span><span>{formatNumber(technical.sma20)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">SMA 50</span><span>{formatNumber(technical.sma50)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">SMA 200</span><span>{formatNumber(technical.sma200)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Support</span><span>{formatNumber(technical.support)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Resistance</span><span>{formatNumber(technical.resistance)}</span></div>
          </div>
          <p className="mt-3 text-xs text-slate-500">{technical.summary}</p>
        </div>
      </div>

      {/* Risk */}
      <div className="p-5 rounded-2xl bg-navy-800 border border-navy-700">
        <h3 className="font-semibold text-white mb-4">Risk Assessment</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {risks.map((r, i) => (
            <div key={i} className="p-3 rounded-xl bg-navy-900/50 border border-navy-600">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-200">{r.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  r.severity === 'High' ? 'bg-red-900/50 text-red-300' :
                  r.severity === 'Medium' ? 'bg-amber-900/50 text-amber-300' :
                  'bg-slate-700 text-slate-300'
                }`}>{r.severity}</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">{r.evidence}</p>
              <p className="text-sm text-slate-300">{r.explanation}</p>
              <p className="text-xs text-slate-500 mt-1">Source: {r.source}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="p-5 rounded-2xl bg-navy-800 border border-navy-700 text-sm">
        <h3 className="font-semibold text-white mb-3">Data Sources & Transparency</h3>
        <ul className="space-y-1 text-slate-400">
          {sources.map((s, i) => (
            <li key={i}>• {s.name} — retrieved {new Date(s.retrievedAt).toLocaleString()} {s.period ? `(${s.period})` : ''}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Every figure is tagged with status (Actual / Calculated / Demo / Unavailable). 
          Never treat model outputs as guarantees. Always cross-check with official company filings and exchange data before investing.
        </p>
      </div>
    </div>
  );
}
