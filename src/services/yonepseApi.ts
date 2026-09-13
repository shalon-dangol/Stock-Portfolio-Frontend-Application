import type { PricePoint, VolumePoint } from "../types/stock";

const YONEPSE_BASE_URL = import.meta.env["VITE_YONEPSE_URL"] as string | undefined ?? "https://shubhamnpk.github.io/yonepse";

export interface NepseStockQuote {
  ticker: string;
  companyName: string;
  currentPrice: number;
  volume: number;
}

type YonepseQuoteRow = Record<string, unknown>;

interface YonepseHistoryResponse {
  dates?: string[];
  columns?: string[];
  series?: Record<string, unknown[][]>;
}

function readString(row: YonepseQuoteRow, fieldNames: string[]): string {
  for (const fieldName of fieldNames) {
    const value = row[fieldName];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function readNumber(row: YonepseQuoteRow, fieldNames: string[]): number {
  for (const fieldName of fieldNames) {
    const value = row[fieldName];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsedValue = Number(value.replace(/,/g, ""));
      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return 0;
}

export function mapYonepseQuote(row: YonepseQuoteRow): NepseStockQuote | null {
  const ticker = readString(row, ["symbol", "ticker", "securitySymbol", "scrip"]);
  const currentPrice = readNumber(row, ["ltp", "lastTradedPrice", "lastPrice", "close"]);

  if (!ticker || currentPrice <= 0) {
    return null;
  }

  return {
    ticker: ticker.toUpperCase(),
    companyName: readString(row, ["name", "companyName", "securityName"]) || ticker.toUpperCase(),
    currentPrice,
    volume: readNumber(row, ["volume", "totalTradeQuantity", "tradeQuantity"]),
  };
}

export async function fetchNepseQuotes(): Promise<NepseStockQuote[]> {
  const response = await fetch(`${YONEPSE_BASE_URL}/data/nepse_data.json`);

  if (!response.ok) {
    throw new Error(`YONEPSE quote request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  const rows = Array.isArray(data) ? (data as YonepseQuoteRow[]) : [];
  if (!Array.isArray(data)) console.warn("YONEPSE quote response is not an array");

  return rows
    .map(mapYonepseQuote)
    .filter((quote): quote is NepseStockQuote => quote !== null);
}

function getCurrentMonthKeys(): string[] {
  // Use NPT (Asia/Kathmandu) to avoid UTC midnight boundary issues (NEPSE closes 15:00 NPT)
  const npt = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }));
  const monthKeys: string[] = [];
  for (let monthOffset = 0; monthOffset < 2; monthOffset++) {
    const date = new Date(npt.getFullYear(), npt.getMonth() - monthOffset, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    monthKeys.push(`${year}-${month}`);
  }
  return monthKeys;
}

async function fetchMonthlyHistory(monthKey: string): Promise<YonepseHistoryResponse | null> {
  const response = await fetch(`${YONEPSE_BASE_URL}/data/ltp/monthly/${monthKey}.json`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`YONEPSE history request failed with status ${response.status}`);
  }

  return (await response.json()) as YonepseHistoryResponse;
}

function mapHistoryPoints(
  ticker: string,
  history: YonepseHistoryResponse,
): { pricePoints: PricePoint[]; volumePoints: VolumePoint[] } {
  const dates = history.dates ?? [];
  const columns = history.columns ?? [];
  const rows = history.series?.[ticker.toUpperCase()] ?? [];
  const dateIndexPosition = columns.indexOf("dateIndex");
  const ltpPosition = columns.indexOf("ltp");
  const volumePosition = columns.indexOf("volume");

  if (dateIndexPosition === -1 || ltpPosition === -1) {
    return { pricePoints: [], volumePoints: [] };
  }

  const pricePoints: PricePoint[] = [];
  const volumePoints: VolumePoint[] = [];

  for (const row of rows) {
    const dateIndex = Number(row[dateIndexPosition]);
    const date = dates[dateIndex];
    const price = Number(row[ltpPosition]);
    const volume = volumePosition === -1 ? 0 : Number(row[volumePosition]);

    if (!date || !Number.isFinite(price)) {
      continue;
    }

    pricePoints.push({ date, price });
    volumePoints.push({ date, volume: Number.isFinite(volume) ? volume : 0 });
  }

  return { pricePoints, volumePoints };
}

export async function fetchNepseHistory(
  ticker: string,
): Promise<{ priceData: PricePoint[]; volumeData: VolumePoint[] }> {
  const monthKeys = getCurrentMonthKeys();
  const monthlyHistories = await Promise.all(monthKeys.map(fetchMonthlyHistory));
  const priceData: PricePoint[] = [];
  const volumeData: VolumePoint[] = [];

  for (const history of monthlyHistories.reverse()) {
    if (!history) {
      continue;
    }

    const mappedData = mapHistoryPoints(ticker, history);
    priceData.push(...mappedData.pricePoints);
    volumeData.push(...mappedData.volumePoints);
  }

  return {
    priceData: priceData.slice(-30),
    volumeData: volumeData.slice(-30),
  };
}
