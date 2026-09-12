import type { PricePoint, Stock, VolumePoint } from "../types/stock";

// Mock data service - provides simulated stock data
// This keeps the app independent of live market feeds (PRD Section 6.4)

// Generate 30 days of price history for a given base price
// Uses a deterministic pattern so the chart looks realistic
function generatePriceHistory(
  basePrice: number,
  volatility: number,
): PricePoint[] {
  const points: PricePoint[] = [];
  const today = new Date();
  let price = basePrice;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Simulate daily price movement with a slight upward trend
    const change = (Math.random() - 0.45) * volatility;
    price = Math.max(price + change, 1);

    points.push({
      date: date.toISOString().split("T")[0],
      price: Number(price.toFixed(2)),
    });
  }

  return points;
}

// Generate volume data for the column chart
function generateVolumeHistory(): VolumePoint[] {
  const points: VolumePoint[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Simulate trading volume between 100k and 2M shares
    const volume = Math.floor(100000 + Math.random() * 1900000);

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
    ticker: "AAPL",
    companyName: "Apple Inc.",
    quantity: 10,
    purchasePrice: 150.0,
    currentPrice: 175.5,
    purchaseDate: "2024-01-15",
  },
  {
    id: "2",
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    quantity: 5,
    purchasePrice: 280.0,
    currentPrice: 310.25,
    purchaseDate: "2024-02-20",
  },
  {
    id: "3",
    ticker: "GOOGL",
    companyName: "Alphabet Inc.",
    quantity: 8,
    purchasePrice: 120.0,
    currentPrice: 145.8,
    purchaseDate: "2024-03-10",
  },
  {
    id: "4",
    ticker: "TSLA",
    companyName: "Tesla, Inc.",
    quantity: 15,
    purchasePrice: 200.0,
    currentPrice: 185.3,
    purchaseDate: "2024-04-05",
  },
];

// Price history for each ticker in the portfolio
// Used by the line chart to show price trends
export const priceHistoryByTicker: Record<string, PricePoint[]> = {
  AAPL: generatePriceHistory(175.5, 4),
  MSFT: generatePriceHistory(310.25, 5),
  GOOGL: generatePriceHistory(145.8, 3),
  TSLA: generatePriceHistory(185.3, 8),
};

// Volume history for each ticker
// Used by the column chart to show trading volume
export const volumeHistoryByTicker: Record<string, VolumePoint[]> = {
  AAPL: generateVolumeHistory(),
  MSFT: generateVolumeHistory(),
  GOOGL: generateVolumeHistory(),
  TSLA: generateVolumeHistory(),
};

// Ensure price/volume history exists for a ticker (creates on-demand for newly added stocks)
export function ensureTickerHistory(ticker: string, basePrice?: number): void {
  if (!priceHistoryByTicker[ticker]) {
    const price = basePrice ?? 100 + Math.random() * 200;
    priceHistoryByTicker[ticker] = generatePriceHistory(price, 5);
  }
  if (!volumeHistoryByTicker[ticker]) {
    volumeHistoryByTicker[ticker] = generateVolumeHistory();
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
