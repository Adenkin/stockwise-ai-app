const KEYS = {
  finnhub: 'stockwise_finnhub_key',
  alphaVantage: 'stockwise_av_key',
} as const;

export function getApiKey(provider: keyof typeof KEYS): string | null {
  try {
    return localStorage.getItem(KEYS[provider]);
  } catch {
    return null;
  }
}

export function setApiKey(provider: keyof typeof KEYS, key: string): void {
  try {
    if (!key.trim()) localStorage.removeItem(KEYS[provider]);
    else localStorage.setItem(KEYS[provider], key.trim());
  } catch {
    // ignore private mode failures
  }
}

export function clearApiKey(provider: keyof typeof KEYS): void {
  try {
    localStorage.removeItem(KEYS[provider]);
  } catch {
    // ignore
  }
}

export function hasLiveKey(): boolean {
  return !!(getApiKey('finnhub') || getApiKey('alphaVantage'));
}
