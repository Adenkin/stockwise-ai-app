import { CompanyData } from '../types/company';

export interface DataProvider {
  name: string;
  canHandle(ticker: string, market?: string): boolean;
  fetchCompany(ticker: string, market?: string): Promise<CompanyData | null>;
}

export async function loadDemoData(): Promise<Record<string, any>> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/demo-stocks.json`);
    if (!res.ok) throw new Error('Demo load failed');
    return await res.json();
  } catch {
    return {};
  }
}
