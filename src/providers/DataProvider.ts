import { CompanyData } from '../types/company';

export interface DataProvider {
  name: string;
  canHandle(ticker: string, market?: string): boolean;
  fetchCompany(ticker: string, market?: string): Promise<CompanyData | null>;
}

export async function loadDemoData(): Promise<Record<string, any>> {
  try {
    // Works both locally and on GitHub Pages
    const base = (import.meta as any).env?.BASE_URL || '/';
    const res = await fetch(`${base}data/demo-stocks.json`);
    if (!res.ok) throw new Error('Demo load failed');
    return await res.json();
  } catch {
    return {};
  }
}
