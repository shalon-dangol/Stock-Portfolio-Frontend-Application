import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer, { addStock, updateStock, deleteStock, setStocks, persistStocks } from "./portfolioSlice";
import { initialPortfolio } from "../services/mockData";

if (!globalThis.crypto.randomUUID) {
  // @ts-expect-error polyfill
  globalThis.crypto.randomUUID = () => "test-uuid-" + Math.random().toString(36).slice(2);
}

function makeStore() {
  const store = configureStore({ reducer: { portfolio: portfolioReducer } });
  // Mirror prod persistence (reducers are pure; persistence is via subscriber)
  let prev = store.getState().portfolio.stocks;
  store.subscribe(() => {
    const cur = store.getState().portfolio.stocks;
    if (cur !== prev) { prev = cur; persistStocks(cur); }
  });
  return store;
}

describe("portfolioStore (Redux Toolkit)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("adds a stock", () => {
    const store = makeStore();
    store.dispatch(setStocks([...initialPortfolio]));
    const before = store.getState().portfolio.stocks.length;
    store.dispatch(addStock({
      ticker: "NVDA",
      companyName: "NVIDIA",
      quantity: 3,
      purchasePrice: 400,
      purchaseDate: "2024-05-01",
    }));
    const after = store.getState().portfolio.stocks;
    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].ticker).toBe("NVDA");
    expect(after[after.length - 1].currentPrice).toBeGreaterThan(0);
  });

  it("updates a stock without affecting others", () => {
    const store = makeStore();
    store.dispatch(setStocks([...initialPortfolio]));
    const stocks = store.getState().portfolio.stocks;
    const id = stocks[0].id;
    const originalSecond = stocks[1].companyName;
    store.dispatch(updateStock({ id, updates: { quantity: 99 } }));
    const updated = store.getState().portfolio.stocks;
    expect(updated.find((s) => s.id === id)?.quantity).toBe(99);
    expect(updated.find((s) => s.id !== id && s.companyName === originalSecond)).toBeDefined();
  });

  it("deletes a stock", () => {
    const store = makeStore();
    store.dispatch(setStocks([...initialPortfolio]));
    const stocks = store.getState().portfolio.stocks;
    const id = stocks[0].id;
    const len = stocks.length;
    store.dispatch(deleteStock(id));
    const after = store.getState().portfolio.stocks;
    expect(after.length).toBe(len - 1);
    expect(after.find((s) => s.id === id)).toBeUndefined();
  });

  it("persists to localStorage", () => {
    const store = makeStore();
    store.dispatch(setStocks([...initialPortfolio]));
    store.dispatch(addStock({
      ticker: "TEST",
      companyName: "Test Corp",
      quantity: 1,
      purchasePrice: 10,
      purchaseDate: "2024-01-01",
    }));
    const saved = localStorage.getItem("portfolio-stocks");
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed.some((s: { ticker: string }) => s.ticker === "TEST")).toBe(true);
  });
});
