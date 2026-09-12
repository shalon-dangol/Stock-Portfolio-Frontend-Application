import { useEffect, useState } from "react";
import PriceChart from "../components/charts/PriceChart";
import VolumeChart from "../components/charts/VolumeChart";
import { getPriceHistory, getVolumeHistory, priceHistoryByTicker } from "../services/mockData";
import { useAppSelector } from "../store";

export default function ChartsPage() {
  const stocks = useAppSelector((s) => s.portfolio.stocks);
  const portfolioTickers = stocks.map((s) => s.ticker);
  const availableTickers = Array.from(new Set([...Object.keys(priceHistoryByTicker), ...portfolioTickers])).sort();
  const [selectedTicker, setSelectedTicker] = useState(availableTickers[0] ?? "AAPL");

  useEffect(() => {
    if (availableTickers.length > 0 && !availableTickers.includes(selectedTicker)) setSelectedTicker(availableTickers[0]);
  }, [availableTickers, selectedTicker]);

  const priceData = selectedTicker ? getPriceHistory(selectedTicker) : [];
  const volumeData = selectedTicker ? getVolumeHistory(selectedTicker) : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Stock Visualization</h2>
          <p className="text-sm text-slate-500 mt-1">Analyze price & volume trends</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="ticker-select" className="text-sm font-medium text-slate-600">Ticker</label>
          <div className="relative">
            <select
              id="ticker-select"
              value={selectedTicker}
              onChange={(e) => setSelectedTicker(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            >
              {availableTickers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <PriceChart ticker={selectedTicker} data={priceData} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <VolumeChart ticker={selectedTicker} data={volumeData} />
        </div>
      </div>
    </div>
  );
}
