import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import type { VolumePoint } from "../../types/stock";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../hooks/useTheme";

const HighchartsReact =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((HighchartsReactModule as any).default ?? (HighchartsReactModule as any).HighchartsReact ?? HighchartsReactModule) as typeof HighchartsReactModule;

interface VolumeChartProps { ticker: string; data: VolumePoint[]; }

function useIsDark(): boolean {
  const ctx = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(() => {
    if (ctx) return ctx.theme === "dark";
    if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) return true;
    return false;
  });
  useEffect(() => {
    if (ctx) { setIsDark(ctx.theme === "dark"); return; }
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [ctx]);
  return isDark;
}

export default function VolumeChart({ ticker, data }: VolumeChartProps) {
  const isDark = useIsDark();

  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const labelColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const barColor = isDark ? "#22d3ee" : "#06b6d4";

  const options: Highcharts.Options = {
    chart: { backgroundColor: "transparent", style: { fontFamily: "Inter, sans-serif" } },
    title: { text: `Trading Volume - ${ticker}`, style: { fontWeight: "700", fontSize: "14px", color: textColor }, align: "left" },
    xAxis: { categories: data.map((p) => p.date), title: { text: undefined }, labels: { style: { color: labelColor, fontSize: "11px" } }, lineColor: gridColor, tickColor: gridColor },
    yAxis: { title: { text: undefined }, labels: { style: { color: labelColor } }, gridLineColor: gridColor },
    series: [{ name: ticker, type: "column", data: data.map((p) => p.volume), color: barColor, borderRadius: 4, borderWidth: 0 } as Highcharts.SeriesColumnOptions],
    tooltip: { valueSuffix: " shares", backgroundColor: isDark ? "#1e293b" : "#0f172a", style: { color: "#fff" }, borderWidth: 0, borderRadius: 10 },
    credits: { enabled: false },
    legend: { enabled: false },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
