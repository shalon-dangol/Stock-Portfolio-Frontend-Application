import { create } from "zustand";
import type { Stock } from "../types/stock";
import {
  ensureTickerHistory,
  getCurrentPrice,
  initialPortfolio,
} from "../services/mockData";

// Portfolio state management using Zustand
// Handles add, edit, delete, and persistence of stock holdings

interface PortfolioState {
  stocks: Stock[];
  addStock: (stock: Omit<Stock, "id" | "currentPrice">) => void;
  updateStock: (id: string, updates: Partial<Stock>) => void;
  deleteStock: (id: string) => void;
}

// Load portfolio from localStorage if available (bonus feature)
function loadInitialStocks(): Stock[] {
  try {
    const saved = localStorage.getItem("portfolio-stocks");
    if (saved) {
      return JSON.parse(saved) as Stock[];
    }
  } catch (error) {
    // If localStorage is unavailable, fall back to mock data
    console.warn("Could not load portfolio from localStorage:", error);
  }
  return initialPortfolio;
}

// Save portfolio to localStorage so it survives page reloads (bonus feature)
function saveStocks(stocks: Stock[]): void {
  try {
    localStorage.setItem("portfolio-stocks", JSON.stringify(stocks));
  } catch (error) {
    console.warn("Could not save portfolio to localStorage:", error);
  }
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  stocks: loadInitialStocks(),

  // Add a new stock to the portfolio
  addStock: (stock) =>
    set((state) => {
      // Ensure chart history exists for new tickers before getting price
      ensureTickerHistory(stock.ticker, stock.purchasePrice);
      const newStock: Stock = {
        ...stock,
        id: crypto.randomUUID(),
        ticker: stock.ticker.toUpperCase(),
        // Use the mock data service to get the current price for this ticker
        currentPrice: getCurrentPrice(stock.ticker.toUpperCase()),
      };
      const updatedStocks = [...state.stocks, newStock];
      saveStocks(updatedStocks);
      return { stocks: updatedStocks };
    }),

  // Update an existing stock in the portfolio
  updateStock: (id, updates) =>
    set((state) => {
      const updatedStocks = state.stocks.map((stock) =>
        stock.id === id ? { ...stock, ...updates } : stock,
      );
      saveStocks(updatedStocks);
      return { stocks: updatedStocks };
    }),

  // Remove a stock from the portfolio
  deleteStock: (id) =>
    set((state) => {
      const updatedStocks = state.stocks.filter((stock) => stock.id !== id);
      saveStocks(updatedStocks);
      return { stocks: updatedStocks };
    }),
}));
