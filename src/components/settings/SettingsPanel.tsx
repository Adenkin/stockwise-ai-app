import { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Shield } from 'lucide-react';
import { getApiKey, setApiKey, clearApiKey } from '../../utils/storage';

interface Props {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: Props) {
  const [finnhub, setFinnhub] = useState('');
  const [ngn, setNgn] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFinnhub(getApiKey('finnhub') || '');
    setNgn(getApiKey('ngnMarket') || '');
  }, []);

  const handleSave = () => {
    setApiKey('finnhub', finnhub);
    setApiKey('ngnMarket', ngn);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearAll = () => {
    clearApiKey('finnhub');
    clearApiKey('ngnMarket');
    setFinnhub('');
    setNgn('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-navy-900 border border-navy-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-600 sticky top-0 bg-navy-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Live Data Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-navy-900/60 border border-navy-600 text-sm text-slate-300">
            <Shield className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            <p>
              Keys are stored <strong className="text-white">only in this browser</strong>. They are never
              uploaded to GitHub. Free-tier data is delayed / refreshed periodically (NGX ~20 min during
              market hours).
            </p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">NGN Market API key (NGX / Nigeria)</label>
            <input
              type="password"
              value={ngn}
              onChange={e => setNgn(e.target.value)}
              placeholder="Paste key from ngnmarket.com"
              className={inputClass}
            />
            <a
              href="https://ngnmarket.com/developer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-400 hover:underline"
            >
              Manage key at ngnmarket.com/developer <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-xs text-slate-500 mt-1">
              Free tier: company list + live prices. Full financials need a paid plan.
            </p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Finnhub API key (US / global)</label>
            <input
              type="password"
              value={finnhub}
              onChange={e => setFinnhub(e.target.value)}
              placeholder="Optional — for US stocks"
              className={inputClass}
            />
            <a
              href="https://finnhub.io/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-400 hover:underline"
            >
              Get free key at finnhub.io <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-slate-500">
            Demo and Manual Input always work without keys. If a live call fails, the app falls back to demo data when available.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-navy-900 font-semibold text-sm"
            >
              {saved ? 'Saved ✓' : 'Save keys'}
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 rounded-xl border border-navy-600 text-slate-300 text-sm hover:bg-navy-700"
            >
              Remove all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
