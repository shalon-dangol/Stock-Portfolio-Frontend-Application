# Stock Portfolio Frontend Application

React + TypeScript frontend for visualizing stock performance and managing a personal portfolio. Built per `stock_portfolio_frontend_prd.pdf`.

## Features

- **Charts (Highcharts)**: Responsive line chart (price trend in NPR) + column chart (trading volume), with mock/simulated data that syncs to portfolio holdings
- **Portfolio Table (TanStack Table + Tailwind CSS)**: Displays ticker, company, quantity, purchase price (NPR), current price (NPR), gain/loss (NPR); with filtering and sorting (bonus)
- **CRUD**: Add / Edit / Delete stocks via Tailwind modal with immediate Redux update
- **Validation**: Ticker/company required, quantity >0, price >=0, valid date (inline errors)
- **State**: Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) with `localStorage` persistence (bonus)
- **Currency**: All monetary values in **NPR (Nepali Rupees)** via `src/utils/currency.ts` (`en-NP` locale)
- **Tests**: Vitest + Testing Library (24 tests)

## Tech Stack

React 19, TypeScript, Vite 8, Redux Toolkit 2 + React-Redux 9, Highcharts 13 (`highcharts-react-official`), TanStack Table 9, Tailwind CSS 4 (`@tailwindcss/vite`), Vitest, Testing Library, jsdom, Oxlint

## Prerequisites

Node.js 18+

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b + vite build -> dist/
npm run preview  # preview production build
```

## Test & Lint

```bash
npm run test       # watch mode
npm run test:run   # single run (24 tests)
npm run lint       # oxlint
```

## Project Structure

```
src/
  components/charts/PriceChart.tsx, VolumeChart.tsx
  components/portfolio/PortfolioTable.tsx, PortfolioSummary.tsx, StockFormDialog.tsx
  components/common/AppLayout.tsx
  pages/PortfolioPage.tsx, ChartsPage.tsx
  store/portfolioSlice.ts          # Redux Toolkit slice + localStorage
  store/index.ts                   # configureStore + typed hooks
  services/mockData.ts             # simulated price/volume history (NPR)
  types/stock.ts
  utils/validation.ts
  utils/currency.ts                # formatNPR()
  tests/setup.ts
```

## PRD Acceptance Criteria Coverage

AC-01 line chart, AC-02 column chart, AC-03 responsive, AC-04 portfolio table, AC-05/06 add, AC-07 edit, AC-08 delete, AC-09 validation, AC-10 reusable components, AC-11 tests, AC-12 README + task-wise commits

## Git History

Task-wise commits: `setup -> charts -> portfolio table + CRUD -> validation -> filtering/sorting & chart sync -> tests -> README -> tailwind modern UI -> redux toolkit migration -> NPR localization`
