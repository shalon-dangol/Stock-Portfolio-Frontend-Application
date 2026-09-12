import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import type { PricePoint } from "../../types/stock";

const HighchartsReact =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((HighchartsReactModule as any).default ?? (HighchartsReactModule as any).HighchartsReact ?? HighchartsReactModule) as typeof HighchartsReactModule;

interface PriceChartProps { ticker: string; data: PricePoint[]; }

export default function PriceChart({ ticker, data }: PriceChartProps) {
  const options: Highcharts.Options = {
    chart: { backgroundColor: "transparent", style: { fontFamily: "Inter, sans-serif" } },
    title: { text: `Price History — ${ticker}`, style: { fontWeight: "700", fontSize: "14px", color: "#0f172a" }, align: "left" },
    xAxis: { categories: data.map((p) => p.date), title: { text: undefined }, labels: { style: { color: "#64748b", fontSize: "11px" } }, lineColor: "#e2e8f0", tickColor: "#e2e8f0" },
    yAxis: { title: { text: "Price (NPR)" }, labels: { style: { color: "#64748b" }, format: "NPR {value}" }, gridLineColor: "#f1f5f9" },
    series: [{ name: ticker, type: "line", data: data.map((p) => p.price), color: "#4f46e5", lineWidth: 2.5, marker: { enabled: false } }],
    tooltip: { valuePrefix: "NPR ", backgroundColor: "#0f172a", style: { color: "#fff" }, borderWidth: 0, borderRadius: 10 },
    credits: { enabled: false },
    legend: { enabled: false },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
