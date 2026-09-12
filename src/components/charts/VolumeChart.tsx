import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import type { VolumePoint } from "../../types/stock";

const HighchartsReact =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((HighchartsReactModule as any).default ?? (HighchartsReactModule as any).HighchartsReact ?? HighchartsReactModule) as typeof HighchartsReactModule;

interface VolumeChartProps { ticker: string; data: VolumePoint[]; }

export default function VolumeChart({ ticker, data }: VolumeChartProps) {
  const options: Highcharts.Options = {
    chart: { backgroundColor: "transparent", style: { fontFamily: "Inter, sans-serif" } },
    title: { text: `Trading Volume — ${ticker}`, style: { fontWeight: "700", fontSize: "14px", color: "#0f172a" }, align: "left" },
    xAxis: { categories: data.map((p) => p.date), title: { text: undefined }, labels: { style: { color: "#64748b", fontSize: "11px" } }, lineColor: "#e2e8f0", tickColor: "#e2e8f0" },
    yAxis: { title: { text: undefined }, labels: { style: { color: "#64748b" } }, gridLineColor: "#f1f5f9" },
    series: [{ name: ticker, type: "column", data: data.map((p) => p.volume), color: "#06b6d4", borderRadius: 4 as any, borderWidth: 0 }],
    tooltip: { valueSuffix: " shares", backgroundColor: "#0f172a", style: { color: "#fff" }, borderWidth: 0, borderRadius: 10 },
    credits: { enabled: false },
    legend: { enabled: false },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
