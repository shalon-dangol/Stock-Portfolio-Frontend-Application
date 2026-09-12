import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PriceChart from "../components/charts/PriceChart";
import VolumeChart from "../components/charts/VolumeChart";
import {
  getPriceHistory,
  getVolumeHistory,
  priceHistoryByTicker,
} from "../services/mockData";
import { usePortfolioStore } from "../store/portfolioStore";

// Charts page - displays stock price and volume charts
// User selects a ticker from the dropdown to view its data
// Tickers are derived from portfolio holdings + mock data so charts stay in sync with CRUD

function ChartsPage() {
  const stocks = usePortfolioStore((s) => s.stocks);
  const portfolioTickers = stocks.map((s) => s.ticker);
  const availableTickers = Array.from(
    new Set([...Object.keys(priceHistoryByTicker), ...portfolioTickers]),
  ).sort();

  // Default to the first ticker so charts are never empty
  const [selectedTicker, setSelectedTicker] = useState(
    availableTickers[0] ?? "AAPL",
  );

  useEffect(() => {
    if (availableTickers.length > 0 && !availableTickers.includes(selectedTicker)) {
      setSelectedTicker(availableTickers[0]);
    }
  }, [availableTickers, selectedTicker]);

  const priceData = selectedTicker ? getPriceHistory(selectedTicker) : [];
  const volumeData = selectedTicker ? getVolumeHistory(selectedTicker) : [];

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Stock Visualization
      </Typography>

      {/* Ticker selector dropdown */}
      <FormControl sx={{ minWidth: 200, mb: 3 }}>
        <InputLabel id="ticker-select-label">Ticker</InputLabel>
        <Select
          labelId="ticker-select-label"
          id="ticker-select"
          value={selectedTicker}
          label="Ticker"
          onChange={(event) => setSelectedTicker(event.target.value)}
        >
          {availableTickers.map((ticker) => (
            <MenuItem key={ticker} value={ticker}>
              {ticker}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price line chart */}
      <Box sx={{ mb: 4 }}>
        <PriceChart ticker={selectedTicker} data={priceData} />
      </Box>

      {/* Volume column chart */}
      <Box>
        <VolumeChart ticker={selectedTicker} data={volumeData} />
      </Box>
    </div>
  );
}

export default ChartsPage;
