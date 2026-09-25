import { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Shield } from 'lucide-react';
import { getApiKey, setApiKey, clearApiKey } from '../../utils/storage';

interface Props {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: Props) {
  const [finnhub, setFinnhub] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFinnhub(getApiKey('finnhub') || '');
  }, []);

  const handleSave = () => {
    setApiKey('finnhub', finnhub);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    clearApiKey('finnhub');
    setFinnhub('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-600">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Live Data Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-navy-900/60 border border-navy-600 text-sm text-slate-300">
            <Shield className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            <p>
              Your API key is stored <strong className="text-white">only in this browser</strong> (localStorage).
              It is never sent to GitHub or any server we control. Free tier data is typically delayed 15–20 minutes.
            </p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Finnhub API key (US / global stocks)</label>
            <input
              type="password"
              value={finnhub}
              onChange={e => setFinnhub(e.target.value)}
              placeholder="Paste free key from finnhub.io"
              className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-navy-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
            NGX stocks still use demo data or Manual Input (free Finnhub does not cover Nigerian listings reliably).
            Demo and Manual modes always work without a key.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-navy-900 font-semibold text-sm"
            >
              {saved ? 'Saved' : 'Save key'}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl border border-navy-600 text-slate-300 text-sm hover:bg-navy-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
