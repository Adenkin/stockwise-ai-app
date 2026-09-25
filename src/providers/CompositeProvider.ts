import { DataProvider } from './DataProvider';
import { CompanyData } from '../types/company';
import { DemoProvider } from './DemoProvider';
import { FinnhubProvider } from './FinnhubProvider';

/**
 * Tries live providers first, then demo.
 * Keys never leave the browser (localStorage only).
 */
export class CompositeProvider implements DataProvider {
  name = 'CompositeProvider';
  private finnhub = new FinnhubProvider();
  private demo = new DemoProvider();

  canHandle() {
    return true;
  }

  async fetchCompany(ticker: string, market?: string): Promise<CompanyData | null> {
    // 1. Try Finnhub for US / international
    if (this.finnhub.canHandle(ticker, market)) {
      const live = await this.finnhub.fetchCompany(ticker, market);
      if (live) return live;
    }

    // 2. Demo fallback (NGX + known examples)
    const demo = await this.demo.fetchCompany(ticker, market);
    if (demo) return demo;

    return null;
  }
}
