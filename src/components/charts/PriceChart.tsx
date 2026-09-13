import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import type { PricePoint } from "../../types/stock";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../hooks/useTheme";

const HighchartsReact =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((HighchartsReactModule as any).default ?? (HighchartsReactModule as any).HighchartsReact ?? HighchartsReactModule) as typeof HighchartsReactModule;

interface PriceChartProps { ticker: string; data: PricePoint[]; }

function useIsDark(): boolean {
  const ctx = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(() => {
    if (ctx) return ctx.theme === "dark";
    if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) return true;
    return false;
  });
  useEffect(() => {
    if (ctx) { setIsDark(ctx.theme === "dark"); return; }
    // fallback: observe class changes when no provider (tests)
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [ctx]);
  return isDark;
}

export default function PriceChart({ ticker, data }: PriceChartProps) {
  const isDark = useIsDark();

  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const labelColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const lineColor = isDark ? "#818cf8" : "#4f46e5";

  const options: Highcharts.Options = {
    chart: { backgroundColor: "transparent", style: { fontFamily: "Inter, sans-serif" } },
    title: { text: `Price History - ${ticker}`, style: { fontWeight: "700", fontSize: "14px", color: textColor }, align: "left" },
    xAxis: { categories: data.map((p) => p.date), title: { text: undefined }, labels: { style: { color: labelColor, fontSize: "11px" } }, lineColor: gridColor, tickColor: gridColor, gridLineColor: gridColor },
    yAxis: { title: { text: "Price (NPR)", style: { color: labelColor } }, labels: { style: { color: labelColor }, format: "NPR {value}" }, gridLineColor: gridColor },
    series: [{ name: ticker, type: "line", data: data.map((p) => p.price), color: lineColor, lineWidth: 2.5, marker: { enabled: false } }],
    tooltip: { valuePrefix: "NPR ", backgroundColor: isDark ? "#1e293b" : "#0f172a", style: { color: "#fff" }, borderWidth: 0, borderRadius: 10 },
    credits: { enabled: false },
    legend: { enabled: false },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
