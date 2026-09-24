import { PriceBar } from '../types/company';
import { TechnicalResult } from '../types/analysis';
import { sma, rsi } from '../utils/math';

export function runTechnicalAnalysis(prices: PriceBar[]): TechnicalResult {
  if (!prices || prices.length < 30) {
    return {
      trend: 'Sideways',
      rsi: null,
      sma20: null,
      sma50: null,
      sma200: null,
      macdSignal: 'Insufficient data',
      overbought: false,
      oversold: false,
      support: null,
      resistance: null,
      summary: 'Insufficient price history for reliable technical analysis.',
    };
  }

  const closes = prices.map(p => p.close);
  const sma20Arr = sma(closes, 20);
  const sma50Arr = sma(closes, 50);
  const sma200Arr = sma(closes, Math.min(200, closes.length));
  const rsiArr = rsi(closes, 14);

  const last = closes.length - 1;
  const lastClose = closes[last];
  const lastSma20 = sma20Arr[last];
  const lastSma50 = sma50Arr[last];
  const lastSma200 = sma200Arr[last];
  const lastRsi = rsiArr[last];

  let trend: 'Bullish' | 'Bearish' | 'Sideways' = 'Sideways';
  if (lastSma20 != null && lastSma50 != null) {
    if (lastClose > lastSma20 && lastSma20 > lastSma50) trend = 'Bullish';
    else if (lastClose < lastSma20 && lastSma20 < lastSma50) trend = 'Bearish';
  }

  const overbought = lastRsi != null && lastRsi > 70;
  const oversold = lastRsi != null && lastRsi < 30;

  // Simple support/resistance from recent range
  const recent = closes.slice(-60);
  const support = Math.min(...recent);
  const resistance = Math.max(...recent);

  let summary = `Price is in a ${trend.toLowerCase()} regime. `;
  if (overbought) summary += 'RSI indicates overbought conditions. ';
  if (oversold) summary += 'RSI indicates oversold conditions. ';
  if (lastSma200 != null) {
    summary += lastClose > lastSma200 ? 'Trading above long-term SMA200.' : 'Trading below long-term SMA200.';
  }

  return {
    trend,
    rsi: lastRsi,
    sma20: lastSma20,
    sma50: lastSma50,
    sma200: lastSma200,
    macdSignal: 'Not computed in this version',
    overbought,
    oversold,
    support,
    resistance,
    summary,
  };
}

export function technicalScore(tech: TechnicalResult): number {
  let s = 50;
  if (tech.trend === 'Bullish') s += 20;
  if (tech.trend === 'Bearish') s -= 20;
  if (tech.oversold) s += 10;
  if (tech.overbought) s -= 10;
  if (tech.sma50 != null && tech.sma200 != null && tech.sma50 > tech.sma200) s += 10;
  return Math.max(0, Math.min(100, s));
}
