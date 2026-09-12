import { useState } from "react";
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
  priceHistoryByTicker,
  volumeHistoryByTicker,
} from "../services/mockData";

// Charts page - displays stock price and volume charts
// User selects a ticker from the dropdown to view its data

// List of tickers available in the mock data
const availableTickers = Object.keys(priceHistoryByTicker);

function ChartsPage() {
  // Default to the first ticker so charts are never empty
  const [selectedTicker, setSelectedTicker] = useState(availableTickers[0]);

  const priceData = priceHistoryByTicker[selectedTicker] ?? [];
  const volumeData = volumeHistoryByTicker[selectedTicker] ?? [];

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
