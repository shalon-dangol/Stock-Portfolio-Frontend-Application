import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PortfolioSummary from "../components/portfolio/PortfolioSummary";
import PortfolioTable from "../components/portfolio/PortfolioTable";
import StockFormDialog from "../components/portfolio/StockFormDialog";
import { usePortfolioStore } from "../store/portfolioStore";
import type { Stock, StockFormValues } from "../types/stock";

// Portfolio page - displays the stock holdings table with summary
// Supports adding, editing, and deleting stocks

function PortfolioPage() {
  const { stocks, addStock, updateStock, deleteStock } = usePortfolioStore();

  // Dialog state: open/closed and which stock is being edited (null = adding new)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  // Open the dialog in "add" mode
  function handleAddClick() {
    setEditingStock(null);
    setDialogOpen(true);
  }

  // Open the dialog in "edit" mode for the selected stock
  function handleEditClick(stock: Stock) {
    setEditingStock(stock);
    setDialogOpen(true);
  }

  // Close the dialog without saving
  function handleDialogClose() {
    setDialogOpen(false);
    setEditingStock(null);
  }

  // Save the form: add a new stock or update the existing one
  function handleDialogSubmit(values: StockFormValues) {
    if (editingStock) {
      updateStock(editingStock.id, {
        companyName: values.companyName,
        quantity: Number(values.quantity),
        purchasePrice: Number(values.purchasePrice),
        purchaseDate: values.purchaseDate,
      });
    } else {
      addStock({
        ticker: values.ticker,
        companyName: values.companyName,
        quantity: Number(values.quantity),
        purchasePrice: Number(values.purchasePrice),
        purchaseDate: values.purchaseDate,
      });
    }
  }

  // Delete a stock after confirmation
  function handleDeleteClick(stock: Stock) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${stock.ticker} from your portfolio?`,
    );
    if (confirmed) {
      deleteStock(stock.id);
    }
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h2">
          My Portfolio
        </Typography>

        {/* Add stock button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Stock
        </Button>
      </Box>

      {/* Summary cards */}
      <PortfolioSummary stocks={stocks} />

      {/* Holdings table */}
      <PortfolioTable
        stocks={stocks}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add/Edit dialog */}
      {/* The key prop remounts the dialog each time it opens, resetting form state */}
      <StockFormDialog
        key={editingStock ? editingStock.id : "new"}
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        editingStock={editingStock}
      />
    </div>
  );
}

export default PortfolioPage;
