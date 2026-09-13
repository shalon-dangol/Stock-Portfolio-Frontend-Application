import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stock } from "../types/stock";
import { ensureTickerHistory, getCurrentPrice, initialPortfolio } from "../services/mockData";

function isValidStock(obj: unknown): obj is Stock {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    typeof o["ticker"] === "string" &&
    typeof o["companyName"] === "string" &&
    typeof o["quantity"] === "number" &&
    Number.isFinite(o["quantity"]) &&
    typeof o["purchasePrice"] === "number" &&
    Number.isFinite(o["purchasePrice"]) &&
    typeof o["currentPrice"] === "number" &&
    Number.isFinite(o["currentPrice"]) &&
    typeof o["purchaseDate"] === "string"
  );
}

function loadInitialStocks(): Stock[] {
  try {
    const saved = localStorage.getItem("portfolio-stocks");
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.every(isValidStock)) return parsed;
      console.warn("Invalid portfolio data in localStorage, using defaults");
    }
  } catch (error) {
    console.warn("Could not load portfolio from localStorage:", error);
  }
  return initialPortfolio.map((s) => ({ ...s }));
}

export function persistStocks(stocks: Stock[]): void {
  try {
    localStorage.setItem("portfolio-stocks", JSON.stringify(stocks));
  } catch (error) {
    console.warn("Could not save portfolio to localStorage:", error);
  }
}

function generateId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    // fall through
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

interface PortfolioState {
  stocks: Stock[];
}

const initialState: PortfolioState = {
  stocks: loadInitialStocks(),
};

// Only mutable fields allowed via updateStock
export type StockUpdates = Partial<Pick<Stock, "companyName" | "quantity" | "purchasePrice" | "purchaseDate">>;

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<Omit<Stock, "id" | "currentPrice">>) => {
      const stock = action.payload;
      const ticker = stock.ticker.toUpperCase();
      ensureTickerHistory(ticker, stock.purchasePrice);
      const newStock: Stock = {
        ...stock,
        id: generateId(),
        ticker,
        currentPrice: getCurrentPrice(ticker),
      };
      state.stocks.push(newStock);
    },
    updateStock: (state, action: PayloadAction<{ id: string; updates: StockUpdates }>) => {
      const { id, updates } = action.payload;
      const target = state.stocks.find((s) => s.id === id);
      if (target) {
        if (updates.companyName !== undefined) target.companyName = updates.companyName;
        if (updates.quantity !== undefined) target.quantity = updates.quantity;
        if (updates.purchasePrice !== undefined) target.purchasePrice = updates.purchasePrice;
        if (updates.purchaseDate !== undefined) target.purchaseDate = updates.purchaseDate;
      }
    },
    updateCurrentPrices: (state, action: PayloadAction<Record<string, number>>) => {
      const pricesByTicker = action.payload;
      state.stocks.forEach((stock) => {
        const latestPrice = pricesByTicker[stock.ticker];
        if (latestPrice !== undefined) {
          stock.currentPrice = latestPrice;
        }
      });
    },
    deleteStock: (state, action: PayloadAction<string>) => {
      state.stocks = state.stocks.filter((s) => s.id !== action.payload);
    },
    setStocks: (state, action: PayloadAction<Stock[]>) => {
      state.stocks = action.payload;
    },
    // for tests: reset to initial or custom
    resetStocks: (state) => {
      state.stocks = initialPortfolio.map((s) => ({ ...s }));
    },
  },
});

export const { addStock, updateStock, updateCurrentPrices, deleteStock, setStocks, resetStocks } = portfolioSlice.actions;
export default portfolioSlice.reducer;
