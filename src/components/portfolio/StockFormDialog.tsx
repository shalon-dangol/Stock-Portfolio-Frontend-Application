import { useState } from "react";
import type { Stock, StockFormValues } from "../../types/stock";
import { hasErrors, validateStockForm, type ValidationErrors } from "../../utils/validation";

interface StockFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: StockFormValues) => void;
  editingStock: Stock | null;
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

export default function StockFormDialog({ open, onClose, onSubmit, editingStock }: StockFormDialogProps) {
  const [formValues, setFormValues] = useState<StockFormValues>(() => buildInitialValues(editingStock));
  const [errors, setErrors] = useState<ValidationErrors>({});

  function handleFieldChange(field: keyof StockFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-bold text-slate-900">{editingStock ? `Edit ${editingStock.ticker}` : "Add Stock"}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-slate-700">Ticker Symbol</label>
            <input id="ticker" aria-label="Ticker Symbol" value={formValues.ticker} onChange={(e) => handleFieldChange("ticker", e.target.value)} disabled={Boolean(editingStock)} placeholder="e.g. AAPL"
              className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 disabled:bg-slate-100 disabled:text-slate-500 ${errors.ticker ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10"}`} />
            {errors.ticker && <p className="mt-1 text-xs text-rose-600">{errors.ticker}</p>}
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Company Name</label>
            <input id="companyName" aria-label="Company Name" value={formValues.companyName} onChange={(e) => handleFieldChange("companyName", e.target.value)} placeholder="e.g. Apple Inc."
              className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 ${errors.companyName ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10"}`} />
            {errors.companyName && <p className="mt-1 text-xs text-rose-600">{errors.companyName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity</label>
              <input id="quantity" aria-label="Quantity" type="number" value={formValues.quantity} onChange={(e) => handleFieldChange("quantity", e.target.value)} placeholder="10"
                className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 ${errors.quantity ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10"}`} />
              {errors.quantity && <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>}
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-slate-700">Purchase Price (NPR)</label>
              <input id="purchasePrice" aria-label="Purchase Price (NPR)" type="number" value={formValues.purchasePrice} onChange={(e) => handleFieldChange("purchasePrice", e.target.value)} placeholder="150.00"
                className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 ${errors.purchasePrice ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10"}`} />
              {errors.purchasePrice && <p className="mt-1 text-xs text-rose-600">{errors.purchasePrice}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-700">Purchase Date</label>
            <input id="purchaseDate" aria-label="Purchase Date" type="date" value={formValues.purchaseDate} onChange={(e) => handleFieldChange("purchaseDate", e.target.value)}
              className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-4 ${errors.purchaseDate ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/10"}`} />
            {errors.purchaseDate && <p className="mt-1 text-xs text-rose-600">{errors.purchaseDate}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10">
              {editingStock ? "Save Changes" : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
