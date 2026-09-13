import { describe, expect, it } from "vitest";
import { mapYonepseQuote } from "./yonepseApi";

describe("yonepseApi", () => {
  it("maps a YONEPSE quote row into the app quote shape", () => {
    const quote = mapYonepseQuote({
      symbol: "nabil",
      securityName: "Nabil Bank Limited",
      ltp: "526",
      volume: "44,305",
    });

    expect(quote).toEqual({
      ticker: "NABIL",
      companyName: "Nabil Bank Limited",
      currentPrice: 526,
      volume: 44305,
    });
  });

  it("ignores quote rows that do not have a ticker or valid price", () => {
    expect(mapYonepseQuote({ symbol: "NABIL", ltp: 0 })).toBeNull();
    expect(mapYonepseQuote({ ltp: 526 })).toBeNull();
  });
});
