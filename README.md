# Stock Portfolio — Wealth Manager

> A modern, responsive stock portfolio tracker built for NEPSE. Visualize price & volume trends, manage holdings with full CRUD, and track gain/loss in **NPR** — with first-class dark mode.

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Highcharts-13-1E1E32?logo=highcharts&logoColor=white" alt="Highcharts" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT" />
</p>

---

## ✨ Overview

Stock Portfolio is a single-page application for visualizing stock performance and managing a personal portfolio aligned with **NEPSE (Nepal Stock Exchange)**. It fetches live quotes and LTP history from **YONEPSE** (`yonepse.com.np`) with graceful fallback to local demo data, so the app remains usable offline or when the upstream API is unavailable.

All monetary values are formatted in **NPR (Nepali Rupees)** via `Intl.NumberFormat` (`en-NP`).

---

## 🎯 Key Features

| Area                | Details                                                                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Charts**          | Responsive **Highcharts** line chart (price trend, NPR) + column chart (trading volume), switchable by ticker; YONEPSE LTP history with mock fallback |
| **Portfolio Table** | **TanStack Table** with ticker, company, quantity, purchase/current price, gain/loss; client-side filtering & sorting                                 |
| **CRUD**            | Add / Edit / Delete holdings via accessible modal with immediate Redux update                                                                         |
| **Validation**      | Inline errors: ticker & company required, quantity > 0, price ≥ 0, valid date                                                                         |
| **Market Data**     | YONEPSE public JSON API for quotes + history; localStorage-persisted portfolio                                                                        |
| **Appearance**      | Light / Dark theme with `prefers-color-scheme` detection, persisted to `localStorage`, FOUC-free inline script, dark-aware charts                     |

---

## 🖥️ Demo

```bash
npm install
npm run dev      # http://localhost:5173
```

| Portfolio (Light)              | Portfolio (Dark)                              | Charts                    |
| ------------------------------ | --------------------------------------------- | ------------------------- |
| Holdings table + summary cards | Full dark theme across modals, inputs, charts | Price & volume per ticker |

> Tip: Use the moon/sun button in the header to toggle themes. System preference is respected on first load.

---

## 🛠️ Tech Stack

| Layer         | Choice                                                                          |
| ------------- | ------------------------------------------------------------------------------- |
| **Framework** | React 19 + TypeScript                                                           |
| **Build**     | Vite 8                                                                          |
| **Styling**   | Tailwind CSS 4 (`@tailwindcss/vite`), `dark:` variants (`@custom-variant dark`) |
| **State**     | Redux Toolkit 2 + React-Redux 9, `localStorage` persistence                     |
| **Table**     | TanStack Table 9                                                                |
| **Charts**    | Highcharts 13 + `highcharts-react-official`                                     |
| **Testing**   | Vitest 5 + Testing Library + jsdom (24 tests)                                   |
| **Lint**      | Oxlint                                                                          |
| **API**       | YONEPSE NEPSE endpoints via `src/services/yonepseApi.ts`                        |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/          # PriceChart.tsx, VolumeChart.tsx (theme-aware Highcharts)
│   ├── portfolio/        # PortfolioTable.tsx, PortfolioSummary.tsx, StockFormDialog.tsx
│   └── common/           # AppLayout.tsx, ThemeToggle.tsx
├── pages/                # PortfolioPage.tsx, ChartsPage.tsx
├── store/                # portfolioSlice.ts (CRUD + localStorage), index.ts (typed hooks)
├── services/             # yonepseApi.ts, mockData.ts (demo fallback)
├── hooks/                # useTheme.tsx (ThemeProvider, toggle, system sync)
├── utils/                # validation.ts, currency.ts (formatNPR)
├── types/                # stock.ts
└── tests/                # setup.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
npm run build      # tsc -b + vite build → dist/
npm run preview    # preview production build
```

### Test & Lint

```bash
npm run test         # watch mode
npm run test:run     # single run
npm run lint         # oxlint
```

---

## 🎨 Theming

The app ships with a complete dark theme:

- **Detection** — inline script in `index.html` reads `localStorage.theme` or `prefers-color-scheme` before React mounts (no flash).
- **Provider** — `ThemeProvider` (`src/hooks/useTheme.tsx`) exposes `theme`, `toggleTheme`, and syncs to `document.documentElement.classList` + `color-scheme`.
- **Tailwind** — `@custom-variant dark (&:is(.dark *))` enables `dark:` utilities; every surface (cards, tables, inputs, modals, charts) has dark variants.
- **Charts** — `PriceChart`/`VolumeChart` switch Highcharts palette (grid, labels, tooltip) based on `useTheme()`.

---

## 🔌 API & Data

- **Live** — `fetchNepseQuotes()` and `fetchNepseHistory(ticker)` hit YONEPSE JSON endpoints.
- **Fallback** — `mockData.ts` supplies deterministic NPR histories when the API is empty or fails; UI surfaces a status message either way.
- **Persistence** — Portfolio slice subscribes to `localStorage` so holdings survive reloads.

---

## 🙏 Acknowledgments

- NEPSE market data via [YONEPSE](https://yonepse.com.np/)
- UI inspired by modern wealth-manager dashboards
