# StockWise AI

**Free AI-Powered Stock Research & Analysis System**

Professional-grade, transparent stock analysis for NGX (Nigerian Exchange) and major international markets.  
Zero mandatory cost. Runs entirely in the browser. Deployable on GitHub Pages.

> **DEMO DATA MODE** is active by default. Results are illustrative. Always verify against official filings before making investment decisions.

## Features

- Company overview with transparent data status tags
- Fundamental analysis (growth, profitability, margins, ROE/ROA)
- Multi-method valuation + simple DCF-style ranges (Bear / Base / Bull)
- Margin of Safety calculation
- Technical indicators (SMA, RSI, trend)
- Risk engine with severity and evidence
- Weighted Decision Engine → **BUY / WATCH / HOLD / AVOID-HIGH-RISK**
- Full score breakdown and “what would change the classification”
- Mobile-friendly professional dark theme
- Local-only storage ready for future watchlist / portfolio / journal

## Quick Start (Local)

```bash
git clone https://github.com/YOUR_USERNAME/stockwise-ai.git
cd stockwise-ai
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to GitHub Pages (Zero Cost)

1. Create a new repository named `stockwise-ai` (or update `base` in `vite.config.ts`).
2. Push this project to the `main` branch.
3. In repository Settings → Pages → Source: GitHub Actions.
4. The included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically.
5. Site will be available at `https://YOUR_USERNAME.github.io/stockwise-ai/`

## Technology

- React 18 + TypeScript + Vite
- Tailwind CSS
- Pure client-side calculation engines
- Demo data provider (easily extended)

## Architecture Highlights

- **DataProvider abstraction** — swap Yahoo / manual / other free sources without changing analysis.
- **Transparent decision rules** — weights and scores are visible.
- **Never fabricates data** — missing values stay “Unavailable”.
- **Optional AI Copilot** (future) — user-supplied key only, never committed.

## Analysing Stocks

### NGX examples (demo)
- GTCO
- ZENITHBANK

### US examples (demo)
- AAPL
- MSFT

Type the ticker and click **ANALYSE STOCK**.

## Adding Real Data Providers

See `src/providers/`. Implement the `DataProvider` interface and register in the orchestrator.  
Respect rate limits and terms of service of any free endpoint you use.

## Disclaimer

StockWise AI is a research and educational tool.  
It does **not** provide personalised investment advice.  
All classifications are model outputs based on available data and transparent rules.  
Past performance and model estimates are not guarantees of future results.  
You are solely responsible for your investment decisions.

## License

MIT

## Roadmap (Optional Future)

- Live free-data adapters (Yahoo unofficial, etc.)
- Full DCF editor with user assumptions
- Watchlist + Portfolio (localStorage)
- Investment journal
- Optional user AI key integration
- Peer comparison tables
- PDF research report export
