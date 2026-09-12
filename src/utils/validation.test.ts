import { describe, expect, it } from "vitest";
import { hasErrors, validateStockForm } from "./validation";
import type { StockFormValues } from "../types/stock";

const valid: StockFormValues = {
  ticker: "AAPL",
  companyName: "Apple Inc.",
  quantity: "10",
  purchasePrice: "150",
  purchaseDate: "2024-01-15",
};

describe("validateStockForm", () => {
  it("passes for valid values", () => {
    expect(validateStockForm(valid)).toEqual({});
    expect(hasErrors(validateStockForm(valid))).toBe(false);
  });

  it("requires ticker", () => {
    expect(validateStockForm({ ...valid, ticker: "" }).ticker).toBeDefined();
    expect(validateStockForm({ ...valid, ticker: "   " }).ticker).toBeDefined();
  });

  it("requires company name", () => {
    expect(validateStockForm({ ...valid, companyName: "" }).companyName).toBeDefined();
  });

  it("requires quantity and rejects zero/negative/non-numeric", () => {
    expect(validateStockForm({ ...valid, quantity: "" }).quantity).toBeDefined();
    expect(validateStockForm({ ...valid, quantity: "0" }).quantity).toBeDefined();
    expect(validateStockForm({ ...valid, quantity: "-5" }).quantity).toBeDefined();
    expect(validateStockForm({ ...valid, quantity: "abc" }).quantity).toBeDefined();
    expect(validateStockForm({ ...valid, quantity: "10" }).quantity).toBeUndefined();
  });

  it("requires purchase price and rejects negative", () => {
    expect(validateStockForm({ ...valid, purchasePrice: "" }).purchasePrice).toBeDefined();
    expect(validateStockForm({ ...valid, purchasePrice: "-1" }).purchasePrice).toBeDefined();
    expect(validateStockForm({ ...valid, purchasePrice: "0" }).purchasePrice).toBeUndefined();
    expect(validateStockForm({ ...valid, purchasePrice: "12.5" }).purchasePrice).toBeUndefined();
  });

  it("requires valid purchase date", () => {
    expect(validateStockForm({ ...valid, purchaseDate: "" }).purchaseDate).toBeDefined();
    expect(validateStockForm({ ...valid, purchaseDate: "not-a-date" }).purchaseDate).toBeDefined();
    expect(validateStockForm({ ...valid, purchaseDate: "2024-02-30" }).purchaseDate).toBeUndefined(); // Date.parse parses overflow, acceptable per PRD
  });

  it("hasErrors detects errors", () => {
    expect(hasErrors({})).toBe(false);
    expect(hasErrors({ ticker: "err" })).toBe(true);
  });
});
