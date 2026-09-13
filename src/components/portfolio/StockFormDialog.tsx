import { useEffect, useMemo, useRef, useState } from "react";
import type { Stock, StockFormValues } from "../../types/stock";
import { hasErrors, validateStockForm, type ValidationErrors } from "../../utils/validation";
import type { NepseStockQuote } from "../../services/yonepseApi";

interface StockFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: StockFormValues) => void;
  editingStock: Stock | null;
  stockSuggestions?: NepseStockQuote[];
}

function buildInitialValues(editingStock: Stock | null): StockFormValues {
  if (editingStock) {
    return {
      ticker: editingStock.ticker,
      companyName: editingStock.companyName,
      quantity: String(editingStock.quantity),
      purchasePrice: String(editingStock.purchasePrice),
      purchaseDate: editingStock.purchaseDate,
    };
  }
  return { ticker: "", companyName: "", quantity: "", purchasePrice: "", purchaseDate: "" };
}

export default function StockFormDialog({
  open,
  onClose,
  onSubmit,
  editingStock,
  stockSuggestions = [],
}: StockFormDialogProps) {
  const [formValues, setFormValues] = useState<StockFormValues>(() => buildInitialValues(editingStock));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormValues(buildInitialValues(editingStock));
    setErrors({});
    setShowSuggestions(false);
  }, [editingStock, open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Focus first input
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const matchingSuggestions = useMemo(() => {
    if (editingStock) return [];
    const tickerText = formValues.ticker.trim().toLowerCase();
    const companyText = formValues.companyName.trim().toLowerCase();
    if (!tickerText && !companyText) return [];
    return stockSuggestions
      .filter((stock) => {
        const ticker = stock.ticker.toLowerCase();
        const companyName = stock.companyName.toLowerCase();
        // Match against the field that triggered search: prefer separate matching
        return (tickerText && ticker.includes(tickerText)) || (companyText && companyName.includes(companyText)) || (!tickerText && companyName.includes(companyText)) || (!companyText && ticker.includes(tickerText));
      })
      .slice(0, 6);
  }, [editingStock, formValues.companyName, formValues.ticker, stockSuggestions]);

  function handleFieldChange(field: keyof StockFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if ((field === "ticker" || field === "companyName") && !editingStock) setShowSuggestions(true);
    // Clear field error on change
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSuggestionClick(suggestion: NepseStockQuote) {
    setFormValues((prev) => ({
      ...prev,
      ticker: suggestion.ticker,
      companyName: suggestion.companyName,
    }));
    setShowSuggestions(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateStockForm(formValues);
    setErrors(validationErrors);
    if (!hasErrors(validationErrors)) {
      onSubmit(formValues);
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div ref={dialogRef} className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editingStock ? `Edit ${editingStock.ticker}` : "Add Stock"}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ticker Symbol</label>
            <div className="relative">
              <input id="ticker" aria-label="Ticker Symbol" value={formValues.ticker} onChange={(e) => handleFieldChange("ticker", e.target.value)} onFocus={() => { if (!editingStock) setShowSuggestions(true); }} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} disabled={Boolean(editingStock)} placeholder="e.g. NABIL"
                className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 disabled:bg-slate-100 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${errors.ticker ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10 dark:border-rose-800" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10 dark:border-slate-700 dark:focus:border-indigo-500"}`} />
              {showSuggestions && matchingSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {matchingSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.ticker}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <span>
                        <span className="block font-semibold text-slate-900 dark:text-white">{suggestion.ticker}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">{suggestion.companyName}</span>
                      </span>
                      <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">NPR {suggestion.currentPrice.toLocaleString("en-NP")}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.ticker && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.ticker}</p>}
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
            <input id="companyName" aria-label="Company Name" value={formValues.companyName} onChange={(e) => handleFieldChange("companyName", e.target.value)} onFocus={() => { if (!editingStock) setShowSuggestions(true); }} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} placeholder="e.g. Nabil Bank Limited"
              className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${errors.companyName ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10 dark:border-rose-800" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10 dark:border-slate-700 dark:focus:border-indigo-500"}`} />
            {errors.companyName && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.companyName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
              <input id="quantity" aria-label="Quantity" type="number" min="1" step="1" value={formValues.quantity} onChange={(e) => handleFieldChange("quantity", e.target.value)} placeholder="10"
                className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${errors.quantity ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10 dark:border-rose-800" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10 dark:border-slate-700 dark:focus:border-indigo-500"}`} />
              {errors.quantity && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.quantity}</p>}
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Purchase Price (NPR)</label>
              <input id="purchasePrice" aria-label="Purchase Price (NPR)" type="number" min="0" step="0.01" value={formValues.purchasePrice} onChange={(e) => handleFieldChange("purchasePrice", e.target.value)} placeholder="150.00"
                className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${errors.purchasePrice ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10 dark:border-rose-800" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10 dark:border-slate-700 dark:focus:border-indigo-500"}`} />
              {errors.purchasePrice && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.purchasePrice}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Purchase Date</label>
            <input id="purchaseDate" aria-label="Purchase Date" type="date" value={formValues.purchaseDate} onChange={(e) => handleFieldChange("purchaseDate", e.target.value)}
              className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] ${errors.purchaseDate ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10 dark:border-rose-800" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10 dark:border-slate-700 dark:focus:border-indigo-500"}`} />
            {errors.purchaseDate && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.purchaseDate}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:shadow-none">
              {editingStock ? "Save Changes" : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
