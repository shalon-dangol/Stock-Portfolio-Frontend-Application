import { describe, expect, it } from "vitest";
import { ensureTickerHistory, getCurrentPrice, getPriceHistory, getVolumeHistory } from "./mockData";

describe("mockData", () => {
  it("ensures history for new ticker", () => {
    const ticker = "NEWCO" + Date.now();
    ensureTickerHistory(ticker, 123);
    const ph = getPriceHistory(ticker);
    const vh = getVolumeHistory(ticker);
    expect(ph.length).toBe(30);
    expect(vh.length).toBe(30);
    expect(getCurrentPrice(ticker)).toBeGreaterThan(0);
  });

  it("returns price history for known ticker", () => {
    expect(getPriceHistory("AAPL").length).toBe(30);
  });
});
