const KEYS = {
  finnhub: 'stockwise_finnhub_key',
  alphaVantage: 'stockwise_av_key',
  ngnMarket: 'stockwise_ngn_key',
} as const;

export type ApiKeyProvider = keyof typeof KEYS;

export function getApiKey(provider: ApiKeyProvider): string | null {
  try {
    return localStorage.getItem(KEYS[provider]);
  } catch {
    return null;
  }
}

export function setApiKey(provider: ApiKeyProvider, key: string): void {
  try {
    if (!key.trim()) localStorage.removeItem(KEYS[provider]);
    else localStorage.setItem(KEYS[provider], key.trim());
  } catch {
    // ignore private mode failures
  }
}

export function clearApiKey(provider: ApiKeyProvider): void {
  try {
    localStorage.removeItem(KEYS[provider]);
  } catch {
    // ignore
  }
}

export function hasLiveKey(): boolean {
  return !!(getApiKey('finnhub') || getApiKey('alphaVantage') || getApiKey('ngnMarket'));
}

export function hasNgnKey(): boolean {
  return !!getApiKey('ngnMarket');
}
