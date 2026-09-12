import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { VolumePoint } from "../../types/stock";

// Column chart showing trading volume over time
// Uses the Highcharts React wrapper for easy integration

interface VolumeChartProps {
  ticker: string;
  data: VolumePoint[];
}

function VolumeChart({ ticker, data }: VolumeChartProps) {
  const options: Highcharts.Options = {
    title: {
      text: `Trading Volume - ${ticker}`,
    },
    xAxis: {
      categories: data.map((point) => point.date),
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Volume (shares)",
      },
    },
    series: [
      {
        name: ticker,
        type: "column",
        data: data.map((point) => point.volume),
      },
    ],
    tooltip: {
      valueSuffix: " shares",
    },
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default VolumeChart;
