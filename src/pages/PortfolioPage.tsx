import { useState } from "react";
import PortfolioSummary from "../components/portfolio/PortfolioSummary";
import PortfolioTable from "../components/portfolio/PortfolioTable";
import StockFormDialog from "../components/portfolio/StockFormDialog";
import { useAppDispatch, useAppSelector } from "../store";
import { addStock, updateStock, deleteStock } from "../store/portfolioSlice";
import type { Stock, StockFormValues } from "../types/stock";

export default function PortfolioPage() {
  const stocks = useAppSelector((s) => s.portfolio.stocks);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  function handleAddClick() { setEditingStock(null); setDialogOpen(true); }
  function handleEditClick(stock: Stock) { setEditingStock(stock); setDialogOpen(true); }
  function handleDialogClose() { setDialogOpen(false); setEditingStock(null); }
  function handleDialogSubmit(values: StockFormValues) {
    if (editingStock) {
      dispatch(updateStock({ id: editingStock.id, updates: {
        companyName: values.companyName,
        quantity: Number(values.quantity),
        purchasePrice: Number(values.purchasePrice),
        purchaseDate: values.purchaseDate,
      }}));
    } else {
      dispatch(addStock({
        ticker: values.ticker,
        companyName: values.companyName,
        quantity: Number(values.quantity),
        purchasePrice: Number(values.purchasePrice),
        purchaseDate: values.purchaseDate,
      }));
    }
  }
  function handleDeleteClick(stock: Stock) {
    if (window.confirm(`Are you sure you want to delete ${stock.ticker} from your portfolio?`)) dispatch(deleteStock(stock.id));
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Portfolio</h2>
          <p className="text-sm text-slate-500 mt-1">Track and manage your investments</p>
        </div>
        <button onClick={handleAddClick} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add Stock
        </button>
      </div>

      <PortfolioSummary stocks={stocks} />
      <PortfolioTable stocks={stocks} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      <StockFormDialog key={editingStock ? editingStock.id : "new"} open={dialogOpen} onClose={handleDialogClose} onSubmit={handleDialogSubmit} editingStock={editingStock} />
    </div>
  );
}
