// Data model for a stock holding in the portfolio
// Matches the PRD Section 6.3 data model
export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string; // ISO date string (YYYY-MM-DD)
}

// A single data point for the line chart (price over time)
export interface PricePoint {
  date: string;
  price: number;
}

// A single data point for the column chart (volume or daily gain/loss)
export interface VolumePoint {
  date: string;
  volume: number;
}

// Form input values for adding/editing a stock
// Uses strings for numeric fields so validation can check them before conversion
export interface StockFormValues {
  ticker: string;
  companyName: string;
  quantity: string;
  purchasePrice: string;
  purchaseDate: string;
}
