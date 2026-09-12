import { useMemo, useState } from "react";
import { coreFeatures, createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
import type { Stock } from "../../types/stock";

interface PortfolioTableProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
}

const features = tableFeatures({ ...coreFeatures });
const columnHelper = createColumnHelper<typeof features, Stock>();

import { formatNPR } from "../../utils/currency";
const formatCurrency = formatNPR;
function calculateGainLoss(stock: Stock): number {
  return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
}

type SortField = "ticker" | "companyName" | "quantity" | "purchasePrice" | "currentPrice" | null;
type SortDir = "asc" | "desc";

export default function PortfolioTable({ stocks, onEdit, onDelete }: PortfolioTableProps) {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  const filteredAndSorted = useMemo(() => {
    let result = stocks;
    if (filter.trim()) {
      const q = filter.toLowerCase();
      result = result.filter((s) => s.ticker.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q));
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField]; const bv = b[sortField];
        let cmp = 0;
        if (typeof av === "string" && typeof bv === "string") cmp = av.localeCompare(bv);
        else cmp = (av as number) - (bv as number);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [stocks, filter, sortField, sortDir]);

  const columns = useMemo(() => columnHelper.columns([
    columnHelper.accessor("ticker", {
      header: "Ticker",
      cell: (info) => <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-1 text-xs font-bold tracking-wide text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor("companyName", { header: "Company" }),
    columnHelper.accessor("quantity", { header: "Quantity", cell: (info) => info.getValue().toLocaleString() }),
    columnHelper.accessor("purchasePrice", { header: "Purchase Price", cell: (info) => formatCurrency(info.getValue()) }),
    columnHelper.accessor("currentPrice", { header: "Current Price", cell: (info) => formatCurrency(info.getValue()) }),
    columnHelper.display({
      id: "gainLoss", header: "Gain / Loss",
      cell: (info) => {
        const stock = info.row.original;
        const gl = calculateGainLoss(stock);
        const pos = gl >= 0;
        return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${pos ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"}`}><span>{pos ? "▲" : "▼"}</span>{formatCurrency(gl)}</span>;
      },
    }),
    columnHelper.display({
      id: "actions", header: "Actions",
      cell: (info) => {
        const stock = info.row.original;
        return (
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(stock)} aria-label={`Edit ${stock.ticker}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onClick={() => onDelete(stock)} aria-label={`Delete ${stock.ticker}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        );
      },
    }),
  ]), [onEdit, onDelete]);

  const table = useTable({ features, columns, data: filteredAndSorted });
  const sortable: Record<string, SortField> = { ticker: "ticker", companyName: "companyName", quantity: "quantity", purchasePrice: "purchasePrice", currentPrice: "currentPrice" };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
          <input aria-label="Filter stocks" placeholder="Search ticker or company..." value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
        </div>
        <span className="text-xs font-medium text-slate-500">{filteredAndSorted.length} holdings</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-slate-50/80 border-b border-slate-200">
                  {headerGroup.headers.map((header) => {
                    const field = sortable[header.column.id] ?? null;
                    const isSortable = !!field;
                    const active = sortField === field;
                    return (
                      <th key={header.id} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {header.isPlaceholder ? null : isSortable ? (
                          <button onClick={() => handleSort(field)} className={`inline-flex items-center gap-1 hover:text-slate-700 ${active ? "text-slate-900" : ""}`}>
                            {table.FlexRender({ header: header })}
                            <span className={`text-[10px] ${active ? "opacity-100" : "opacity-30"}`}>{active && sortDir === "desc" ? "▼" : "▲"}</span>
                          </button>
                        ) : table.FlexRender({ header: header })}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">No stocks found.</td></tr>
              ) : table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition">
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-slate-700">{table.FlexRender({ cell: cell })}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
