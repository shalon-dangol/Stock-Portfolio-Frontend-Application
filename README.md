# Stock Portfolio Frontend Application

React + TypeScript frontend for visualizing stock performance and managing a personal portfolio. Built per `stock_portfolio_frontend_prd.pdf`.

## Features

- **Charts (Highcharts)**: Responsive line chart (price trend) + column chart (trading volume), with mock/simulated data that syncs to portfolio holdings
- **Portfolio Table (TanStack Table + MUI)**: Displays ticker, company, quantity, purchase price, current price, gain/loss; with filtering and sorting (bonus)
- **CRUD**: Add / Edit / Delete stocks via MUI Dialog with immediate UI update
- **Validation**: Ticker/company required, quantity >0, price >=0, valid date (inline errors)
- **State**: Zustand with `localStorage` persistence (bonus)
- **Tests**: Vitest + Testing Library

## Tech Stack

React 19, TypeScript, Vite, Zustand, Highcharts (`highcharts-react-official`), TanStack Table 9, MUI 9, Vitest, Testing Library, jsdom, Oxlint

## Prerequisites

Node.js 18+

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build -> dist/
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
  store/portfolioStore.ts        # Zustand + localStorage
  services/mockData.ts           # simulated price/volume history
  types/stock.ts
  utils/validation.ts
  tests/setup.ts
```

## PRD Acceptance Criteria Coverage

AC-01 line chart, AC-02 column chart, AC-03 responsive, AC-04 portfolio table, AC-05/06 add, AC-07 edit, AC-08 delete, AC-09 validation, AC-10 reusable components, AC-11 tests, AC-12 README + task-wise commits

## Git History

Task-wise commits: `setup -> charts -> portfolio table + CRUD -> validation -> filtering/sorting & chart sync -> tests -> README`
