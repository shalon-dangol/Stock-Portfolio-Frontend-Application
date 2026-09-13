import { useEffect, useMemo, useState } from "react";
import PriceChart from "../components/charts/PriceChart";
import VolumeChart from "../components/charts/VolumeChart";
import { getPriceHistory, getVolumeHistory, priceHistoryByTicker } from "../services/mockData";
import { fetchNepseHistory } from "../services/yonepseApi";
import { useAppSelector } from "../store";
import type { PricePoint, VolumePoint } from "../types/stock";

export default function ChartsPage() {
  const stocks = useAppSelector((s) => s.portfolio.stocks);
  const availableTickers = useMemo(() => {
    const portfolioTickers = stocks.map((stock) => stock.ticker);
    return Array.from(new Set([...Object.keys(priceHistoryByTicker), ...portfolioTickers])).sort();
  }, [stocks]);
  // Default to first available ticker, never hardcode AAPL
  const [selectedTicker, setSelectedTicker] = useState(() => availableTickers[0] ?? "");
  const activeTicker = availableTickers.includes(selectedTicker) ? selectedTicker : availableTickers[0] ?? "";

  // Keep selectedTicker in sync when availableTickers changes and initial was empty
  useEffect(() => {
    if (!selectedTicker && availableTickers[0]) setSelectedTicker(availableTickers[0]);
  }, [availableTickers, selectedTicker]);

  // Derive fallback data directly from activeTicker (no stale useState)
  const fallbackPriceData = useMemo(() => {
    return activeTicker ? getPriceHistory(activeTicker) : [];
  }, [activeTicker]);
  const fallbackVolumeData = useMemo(() => {
    return activeTicker ? getVolumeHistory(activeTicker) : [];
  }, [activeTicker]);

  const [priceData, setPriceData] = useState<PricePoint[]>(() => fallbackPriceData);
  const [volumeData, setVolumeData] = useState<VolumePoint[]>(() => fallbackVolumeData);
  const [chartStatus, setChartStatus] = useState("Loading YONEPSE chart data...");

  // Sync priceData/volumeData immediately when ticker changes (before fetch)
  useEffect(() => {
    setPriceData(fallbackPriceData);
    setVolumeData(fallbackVolumeData);
  }, [fallbackPriceData, fallbackVolumeData]);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadChartData() {
      if (!activeTicker) {
        setPriceData([]);
        setVolumeData([]);
        setChartStatus("No holdings available. Add stocks to see charts.");
        return;
      }
      setChartStatus("Loading YONEPSE chart data...");
      try {
        const history = await fetchNepseHistory(activeTicker);
        if (controller.signal.aborted || !isMounted) return;
        if (history.priceData.length === 0) {
          setPriceData(fallbackPriceData);
          setVolumeData(fallbackVolumeData);
          setChartStatus("YONEPSE history unavailable for this ticker. Showing fallback chart data.");
          return;
        }
        setPriceData(history.priceData);
        setVolumeData(history.volumeData);
        setChartStatus("Showing latest YONEPSE LTP history");
      } catch {
        if (isMounted && !controller.signal.aborted) {
          setPriceData(fallbackPriceData);
          setVolumeData(fallbackVolumeData);
          setChartStatus("Could not load YONEPSE history. Showing fallback chart data.");
        }
      }
    }
    loadChartData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [activeTicker, fallbackPriceData, fallbackVolumeData]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Stock Visualization</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1" aria-live="polite">{chartStatus}</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="ticker-select" className="text-sm font-medium text-slate-600 dark:text-slate-300">Ticker</label>
          <div className="relative">
            <select
              id="ticker-select"
              value={activeTicker}
              onChange={(e) => setSelectedTicker(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
            >
              {availableTickers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {activeTicker === "" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">No holdings available. Add stocks to see charts.</div>
      ) : (
        <div className="grid gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <PriceChart ticker={activeTicker} data={priceData} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <VolumeChart ticker={activeTicker} data={volumeData} />
          </div>
        </div>
      )}
    </div>
  );
}
