import type { Stock } from "../../types/stock";

interface PortfolioSummaryProps {
  stocks: Stock[];
}

function calculateTotalValue(stocks: Stock[]): number {
  return stocks.reduce((total, s) => total + s.quantity * s.currentPrice, 0);
}
function calculateTotalCost(stocks: Stock[]): number {
  return stocks.reduce((total, s) => total + s.quantity * s.purchasePrice, 0);
}
import { formatNPR } from "../../utils/currency";
const formatCurrency = formatNPR;

export default function PortfolioSummary({ stocks }: PortfolioSummaryProps) {
  const totalValue = calculateTotalValue(stocks);
  const totalCost = calculateTotalCost(stocks);
  const totalGainLoss = totalValue - totalCost;
  const gainPct = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const hasHoldings = stocks.length > 0 && totalCost !== 0;
  const isPositive = hasHoldings ? totalGainLoss > 0 : false;
  const isNeutral = !hasHoldings || totalGainLoss === 0;

  const cards = [
    {
      label: "Total Value",
      value: formatCurrency(totalValue),
      sub: `${stocks.length} holdings`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      ),
      gradient: "from-indigo-600 to-violet-600",
      bg: "bg-indigo-600",
    },
    {
      label: "Total Gain / Loss",
      value: `${isNeutral ? "" : isPositive ? "+" : ""}${formatCurrency(totalGainLoss)}`,
      sub: isNeutral ? `${gainPct.toFixed(2)}% — all time` : `${isPositive ? "+" : ""}${gainPct.toFixed(2)}% ${isPositive ? "▲" : "▼"} all time`,
      icon: isNeutral ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      ) : isPositive ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
      ),
      gradient: isNeutral ? "from-slate-400 to-slate-500" : isPositive ? "from-emerald-500 to-teal-600" : "from-rose-500 to-orange-500",
       bg: isNeutral ? "bg-slate-400" : isPositive ? "bg-emerald-500" : "bg-rose-500",
    },
    {
      label: "Holdings",
      value: String(stocks.length),
      sub: "diversified positions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      ),
      gradient: "from-slate-800 to-slate-900",
      bg: "bg-slate-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">{c.label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{c.value}</p>
              <p className={`mt-1 text-xs font-medium ${c.label === "Total Gain / Loss" ? (isNeutral ? "text-slate-500 dark:text-slate-400" : isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400") : "text-slate-500 dark:text-slate-400"}`}>{c.sub}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-lg`}>
              {c.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
