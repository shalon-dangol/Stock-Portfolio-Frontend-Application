import { useEffect, useState } from "react";
import PortfolioSummary from "../components/portfolio/PortfolioSummary";
import PortfolioTable from "../components/portfolio/PortfolioTable";
import StockFormDialog from "../components/portfolio/StockFormDialog";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchNepseQuotes, type NepseStockQuote } from "../services/yonepseApi";
import { addStock, updateStock, updateCurrentPrices, deleteStock } from "../store/portfolioSlice";
import type { Stock, StockFormValues } from "../types/stock";

export default function PortfolioPage() {
  const stocks = useAppSelector((s) => s.portfolio.stocks);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [marketStatus, setMarketStatus] = useState("Loading NEPSE prices...");
  const [stockSuggestions, setStockSuggestions] = useState<NepseStockQuote[]>([]);

  const [pendingDelete, setPendingDelete] = useState<Stock | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function refreshMarketPrices() {
      try {
        const quotes = await fetchNepseQuotes();
        if (controller.signal.aborted || !isMounted) return;
        const pricesByTicker = quotes.reduce<Record<string, number>>((prices, quote) => {
          prices[quote.ticker] = quote.currentPrice;
          return prices;
        }, {});

        dispatch(updateCurrentPrices(pricesByTicker));

        if (isMounted) {
          setStockSuggestions(quotes);
          setMarketStatus("Using latest YONEPSE market prices");
        }
      } catch {
        if (isMounted && !controller.signal.aborted) {
          setMarketStatus("Could not load YONEPSE prices. Showing saved portfolio prices.");
        }
      }
    }

    refreshMarketPrices();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dispatch]);

  function handleAddClick() { setEditingStock(null); setDialogOpen(true); }
  function handleEditClick(stock: Stock) { setEditingStock(stock); setDialogOpen(true); }
  function handleDialogClose() { setDialogOpen(false); setEditingStock(null); }
  function handleDialogSubmit(values: StockFormValues) {
    const quantity = Number(values.quantity);
    const purchasePrice = Number(values.purchasePrice);
    if (!Number.isFinite(quantity) || !Number.isFinite(purchasePrice)) return;
    if (editingStock) {
      dispatch(updateStock({ id: editingStock.id, updates: {
        companyName: values.companyName,
        quantity,
        purchasePrice,
        purchaseDate: values.purchaseDate,
      }}));
    } else {
      dispatch(addStock({
        ticker: values.ticker,
        companyName: values.companyName,
        quantity,
        purchasePrice,
        purchaseDate: values.purchaseDate,
      }));
    }
  }
  function handleDeleteClick(stock: Stock) {
    setPendingDelete(stock);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Portfolio</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{marketStatus}</p>
        </div>
        <button onClick={handleAddClick} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:shadow-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add Stock
        </button>
      </div>

      <PortfolioSummary stocks={stocks} />
      <PortfolioTable stocks={stocks} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      <StockFormDialog
        key={editingStock ? editingStock.id : "new"}
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        editingStock={editingStock}
        stockSuggestions={stockSuggestions}
      />
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPendingDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete {pendingDelete.ticker}?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Are you sure you want to delete {pendingDelete.ticker} from your portfolio?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setPendingDelete(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
              <button onClick={() => { dispatch(deleteStock(pendingDelete.id)); setPendingDelete(null); }} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
