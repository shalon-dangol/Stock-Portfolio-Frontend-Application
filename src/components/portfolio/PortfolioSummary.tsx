import { Card, CardContent, Grid, Typography } from "@mui/material";
import type { Stock } from "../../types/stock";

// Summary cards showing portfolio totals
// Displays total value, total gain/loss, and number of holdings

interface PortfolioSummaryProps {
  stocks: Stock[];
}

// Calculate the total market value of all holdings
function calculateTotalValue(stocks: Stock[]): number {
  return stocks.reduce(
    (total, stock) => total + stock.quantity * stock.currentPrice,
    0,
  );
}

// Calculate the total cost basis (what was paid for all holdings)
function calculateTotalCost(stocks: Stock[]): number {
  return stocks.reduce(
    (total, stock) => total + stock.quantity * stock.purchasePrice,
    0,
  );
}

// Format a number as USD currency
function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function PortfolioSummary({ stocks }: PortfolioSummaryProps) {
  const totalValue = calculateTotalValue(stocks);
  const totalCost = calculateTotalCost(stocks);
  const totalGainLoss = totalValue - totalCost;
  const gainLossColor = totalGainLoss >= 0 ? "success.main" : "error.main";

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Total portfolio value */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Total Value
            </Typography>
            <Typography variant="h5" component="div">
              {formatCurrency(totalValue)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total gain/loss */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Total Gain / Loss
            </Typography>
            <Typography variant="h5" component="div" color={gainLossColor}>
              {formatCurrency(totalGainLoss)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Number of holdings */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Holdings
            </Typography>
            <Typography variant="h5" component="div">
              {stocks.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default PortfolioSummary;
