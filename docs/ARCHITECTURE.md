# StockWise AI Architecture

See the root README and the original Technical Blueprint for full details.

## Key Principles
1. Zero mandatory cost
2. Client-side only
3. Transparent calculations
4. Never fabricate data
5. Provider abstraction
6. Decision engine with visible weights and reasons

## Extending Data Providers
Implement `DataProvider` in `src/providers/` and call it from the search handler.
