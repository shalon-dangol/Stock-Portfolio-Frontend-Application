import type { PricePoint, Stock, VolumePoint } from "../types/stock";

// Mock data service - provides simulated stock data
// This keeps the app independent of live market feeds (PRD Section 6.4)

// Deterministic seeded PRNG (mulberry32) for reproducible mock data
function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(0) | 0;
  return h;
}

// Generate 30 days of price history for a given base price - deterministic via seed
function generatePriceHistory(
  basePrice: number,
  volatility: number,
  seedStr?: string,
): PricePoint[] {
  const rand = seededRandom(hashString(`${basePrice}-${volatility}-${seedStr ?? "default"}`));
  const points: PricePoint[] = [];
  const today = new Date();
  let price = basePrice;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const change = (rand() - 0.45) * volatility;
    price = Math.max(price + change, 1);
    points.push({
      date: date.toISOString().split("T")[0],
      price: Number(price.toFixed(2)),
    });
  }
  return points;
}

// Generate volume data for the column chart - deterministic per ticker
function generateVolumeHistory(seedStr?: string): VolumePoint[] {
  const rand = seededRandom(hashString(seedStr ?? "volume-default"));
  const points: VolumePoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const volume = Math.floor(100000 + rand() * 1900000);
    points.push({
      date: date.toISOString().split("T")[0],
      volume,
    });
  }
  return points;
}

// Initial portfolio data shown when the app first loads
export const initialPortfolio: Stock[] = [
  {
    id: "1",
    ticker: "NABIL",
    companyName: "Nabil Bank Limited",
    quantity: 10,
    purchasePrice: 520.0,
    currentPrice: 526.0,
    purchaseDate: "2024-01-15",
  },
  {
    id: "2",
    ticker: "NICA",
    companyName: "NIC Asia Bank Limited",
    quantity: 5,
    purchasePrice: 410.0,
    currentPrice: 425.0,
    purchaseDate: "2024-02-20",
  },
  {
    id: "3",
    ticker: "NTC",
    companyName: "Nepal Doorsanchar Company Limited",
    quantity: 8,
    purchasePrice: 900.0,
    currentPrice: 935.0,
    purchaseDate: "2024-03-10",
  },
  {
    id: "4",
    ticker: "NRIC",
    companyName: "Nepal Reinsurance Company Limited",
    quantity: 15,
    purchasePrice: 780.0,
    currentPrice: 760.0,
    purchaseDate: "2024-04-05",
  },
];

// Price history for each ticker in the portfolio
// Used by the line chart to show price trends
export const priceHistoryByTicker: Record<string, PricePoint[]> = {
  NABIL: generatePriceHistory(526, 8, "NABIL"),
  NICA: generatePriceHistory(425, 7, "NICA"),
  NTC: generatePriceHistory(935, 12, "NTC"),
  NRIC: generatePriceHistory(760, 10, "NRIC"),
};

// Volume history for each ticker
// Used by the column chart to show trading volume
export const volumeHistoryByTicker: Record<string, VolumePoint[]> = {
  NABIL: generateVolumeHistory("NABIL"),
  NICA: generateVolumeHistory("NICA"),
  NTC: generateVolumeHistory("NTC"),
  NRIC: generateVolumeHistory("NRIC"),
};

// Ensure price/volume history exists for a ticker (creates on-demand for newly added stocks)
export function ensureTickerHistory(ticker: string, basePrice?: number): void {
  if (!priceHistoryByTicker[ticker]) {
    const price = basePrice ?? 100 + hashString(ticker) % 200;
    priceHistoryByTicker[ticker] = generatePriceHistory(price, 5, ticker);
  }
  if (!volumeHistoryByTicker[ticker]) {
    volumeHistoryByTicker[ticker] = generateVolumeHistory(ticker);
  }
}

// Get price history for a ticker (ensures it exists)
export function getPriceHistory(ticker: string): PricePoint[] {
  ensureTickerHistory(ticker);
  return priceHistoryByTicker[ticker];
}

// Get volume history for a ticker (ensures it exists)
export function getVolumeHistory(ticker: string): VolumePoint[] {
  ensureTickerHistory(ticker);
  return volumeHistoryByTicker[ticker];
}

// Get the latest price for a ticker from the mock data
export function getCurrentPrice(ticker: string): number {
  ensureTickerHistory(ticker);
  const history = priceHistoryByTicker[ticker];
  if (!history || history.length === 0) {
    return 0;
  }
  return history[history.length - 1].price;
}
