import { DataProvider } from './DataProvider';
import { CompanyData } from '../types/company';
import { DemoProvider } from './DemoProvider';
import { FinnhubProvider } from './FinnhubProvider';
import { NgnMarketProvider } from './NgnMarketProvider';

export class CompositeProvider implements DataProvider {
  name = 'CompositeProvider';
  private ngn = new NgnMarketProvider();
  private finnhub = new FinnhubProvider();
  private demo = new DemoProvider();

  canHandle() {
    return true;
  }

  async fetchCompany(ticker: string, market?: string): Promise<CompanyData | null> {
    if (market === 'NGX' || market === 'Auto' || !market) {
      if (this.ngn.canHandle(ticker, market)) {
        const live = await this.ngn.fetchCompany(ticker, market);
        if (live) return live;
      }
    }

    if (this.finnhub.canHandle(ticker, market)) {
      const live = await this.finnhub.fetchCompany(ticker, market);
      if (live) return live;
    }

    const demo = await this.demo.fetchCompany(ticker, market);
    if (demo) return demo;

    return null;
  }
}
