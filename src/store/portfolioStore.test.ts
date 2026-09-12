import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePortfolioStore } from "./portfolioStore";
import { initialPortfolio } from "../services/mockData";

// Mock crypto.randomUUID for jsdom
if (!globalThis.crypto.randomUUID) {
  // @ts-expect-error polyfill
  globalThis.crypto.randomUUID = () => "test-uuid-" + Math.random().toString(36).slice(2);
}

describe("portfolioStore", () => {
  beforeEach(() => {
    localStorage.clear();
    usePortfolioStore.setState({ stocks: [...initialPortfolio] });
    vi.clearAllMocks();
  });

  it("adds a stock", () => {
    const { addStock } = usePortfolioStore.getState();
    const before = usePortfolioStore.getState().stocks.length;
    addStock({
      ticker: "NVDA",
      companyName: "NVIDIA",
      quantity: 3,
      purchasePrice: 400,
      purchaseDate: "2024-05-01",
    });
    const after = usePortfolioStore.getState().stocks;
    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].ticker).toBe("NVDA");
    expect(after[after.length - 1].currentPrice).toBeGreaterThan(0);
  });

  it("updates a stock without affecting others", () => {
    const { stocks, updateStock } = usePortfolioStore.getState();
    const id = stocks[0].id;
    const originalSecond = stocks[1].companyName;
    updateStock(id, { quantity: 99 });
    const updated = usePortfolioStore.getState().stocks;
    expect(updated.find((s) => s.id === id)?.quantity).toBe(99);
    expect(updated.find((s) => s.id !== id && s.companyName === originalSecond)).toBeDefined();
  });

  it("deletes a stock", () => {
    const { stocks, deleteStock } = usePortfolioStore.getState();
    const id = stocks[0].id;
    const len = stocks.length;
    deleteStock(id);
    const after = usePortfolioStore.getState().stocks;
    expect(after.length).toBe(len - 1);
    expect(after.find((s) => s.id === id)).toBeUndefined();
  });

  it("persists to localStorage", () => {
    const { addStock } = usePortfolioStore.getState();
    addStock({
      ticker: "TEST",
      companyName: "Test Corp",
      quantity: 1,
      purchasePrice: 10,
      purchaseDate: "2024-01-01",
    });
    const saved = localStorage.getItem("portfolio-stocks");
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed.some((s: { ticker: string }) => s.ticker === "TEST")).toBe(true);
  });
});
