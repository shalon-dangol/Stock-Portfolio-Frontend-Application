import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stock } from "../types/stock";
import { ensureTickerHistory, getCurrentPrice, initialPortfolio } from "../services/mockData";

function loadInitialStocks(): Stock[] {
  try {
    const saved = localStorage.getItem("portfolio-stocks");
    if (saved) return JSON.parse(saved) as Stock[];
  } catch (error) {
    console.warn("Could not load portfolio from localStorage:", error);
  }
  return initialPortfolio;
}

function saveStocks(stocks: Stock[]): void {
  try {
    localStorage.setItem("portfolio-stocks", JSON.stringify(stocks));
  } catch (error) {
    console.warn("Could not save portfolio to localStorage:", error);
  }
}

interface PortfolioState {
  stocks: Stock[];
}

const initialState: PortfolioState = {
  stocks: loadInitialStocks(),
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<Omit<Stock, "id" | "currentPrice">>) => {
      const stock = action.payload;
      ensureTickerHistory(stock.ticker, stock.purchasePrice);
      const newStock: Stock = {
        ...stock,
        id: crypto.randomUUID(),
        ticker: stock.ticker.toUpperCase(),
        currentPrice: getCurrentPrice(stock.ticker.toUpperCase()),
      };
      state.stocks.push(newStock);
      saveStocks(state.stocks);
    },
    updateStock: (state, action: PayloadAction<{ id: string; updates: Partial<Stock> }>) => {
      const { id, updates } = action.payload;
      const target = state.stocks.find((s) => s.id === id);
      if (target) Object.assign(target, updates);
      saveStocks(state.stocks);
    },
    deleteStock: (state, action: PayloadAction<string>) => {
      state.stocks = state.stocks.filter((s) => s.id !== action.payload);
      saveStocks(state.stocks);
    },
    setStocks: (state, action: PayloadAction<Stock[]>) => {
      state.stocks = action.payload;
      saveStocks(state.stocks);
    },
    // for tests: reset to initial or custom
    resetStocks: (state) => {
      state.stocks = [...initialPortfolio];
      saveStocks(state.stocks);
    },
  },
});

export const { addStock, updateStock, deleteStock, setStocks, resetStocks } = portfolioSlice.actions;
export default portfolioSlice.reducer;
