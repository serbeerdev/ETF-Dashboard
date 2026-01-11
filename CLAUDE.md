# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **ETF Dashboard** built with Next.js 16 (App Router), TypeScript, and Shadcn/UI. It displays real-time ETF data, historical charts, holdings, insights, and news. The application fetches data from a FetchETF backend service.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Environment Variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000  # FetchETF backend URL
NEXT_PUBLIC_APP_NAME=ETF Dashboard
```

## Architecture

### Hybrid Server/Client API Pattern

The app uses a dual API approach to handle CORS and optimize performance:

- **Server Components** (`app/(dashboard)/**/*.tsx`): Call backend API directly via `lib/api/etf-api.ts`
- **Client Components** (interactive components): Use Next.js API routes in `app/api/` as a proxy to avoid CORS

The `EtfApiService` class in `lib/api/etf-api.ts` automatically detects server vs client context and routes requests accordingly:
- Server: Direct call to `${NEXT_PUBLIC_API_URL}${endpoint}`
- Client: Proxy via `/api${endpoint}` (e.g., `/api/etf/AAPL` → `http://localhost:3000/etf/AAPL`)

### Data Fetching Strategy

**Server Components**: Use `etfApi` directly for initial data loading (good for SEO, faster initial paint)

**Client Components**: Use custom hooks from `hooks/use-etf-data.ts` with TanStack Query:
- `useEtfPrice()` - Real-time prices (auto-refreshes every 1 min, 10s stale)
- `useDailyHistory()` - Historical data (1h stale)
- `useIntradayHistory()` - Intraday data (30s stale, 1m refresh)
- `useEtfInfo()`, `useHoldings()`, `useInsights()`, `useNews()` - Fundamental data (24h stale)

All query keys are managed via the `etfQueryKeys` factory for consistency.

### Directory Structure

```
app/
├── (dashboard)/          # Route group for dashboard pages
│   ├── etf/[symbol]/    # Dynamic ETF detail pages
│   └── page.tsx         # Homepage (featured ETFs)
├── api/etf/             # API proxy routes (mirror backend endpoints)
├── layout.tsx           # Root layout + theme provider
└── globals.css          # Global styles with dark mode overrides

components/
├── ui/                  # Shadcn/UI base components
├── etf/                 # ETF-specific components
├── chart/               # Recharts wrapper components
├── layout/              # Navbar, etc.
└── theme/               # Theme toggle, providers

lib/
├── api/etf-api.ts       # Centralized API service
└── react-query/         # QueryClient provider

hooks/use-etf-data.ts    # All TanStack Query hooks
types/etf.types.ts       # TypeScript definitions for all ETF data
```

## Key Technologies & Patterns

- **Next.js 16 App Router**: Server components by default, client components marked with `"use client"`
- **TanStack Query (React Query)**: Caching, background refetching, stale-while-revalidate
- **Shadcn/UI + Radix UI**: Accessible component primitives with Tailwind styling
- **Tailwind CSS v4**: New `@import "tailwindcss"` directive syntax
- **next-themes**: Dark mode with system preference detection
- **Recharts**: Data visualization for price history
- **Route Groups**: `(dashboard)` organizes routes without affecting URL structure

## Styling Notes

- Dark mode is implemented via both Tailwind's `dark:` classes and manual CSS overrides in `app/globals.css`
- The globals.css file contains explicit `!important` overrides for dark mode - check there first if styling issues occur
- Base color is slate (configured in Shadcn/UI)

## API Endpoints (Backend)

The backend (FetchETF) exposes these endpoints, all proxied via `/api/etf/*`:

- `GET /etf/search/{query}` - Search ETFs
- `GET /etf/discover/featured` - Featured ETFs list
- `GET /etf/{symbol}` - Full ETF info
- `GET /etf/{symbol}/price` - Current price quote
- `GET /etf/{symbol}/history/daily` - Daily historical data
- `GET /etf/{symbol}/history/intraday` - Intraday data
- `GET /etf/{symbol}/holdings` - Top holdings and sector allocation
- `GET /etf/{symbol}/insights` - Technical analysis
- `GET /etf/{symbol}/news` - Recent news
- `GET /etf/{symbol}/recommendations` - Analyst recommendations
- `GET /etf/{symbol}/dividends` - Dividend history
- `GET /etf/{symbol}/report` - Full combined report

## Type Safety

All ETF data types are centralized in `types/etf.types.ts`. When adding new API endpoints, update this file first.
