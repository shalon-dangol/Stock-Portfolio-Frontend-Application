import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { PricePoint } from "../../types/stock";

// Line chart showing stock price over time
// Uses the Highcharts React wrapper for easy integration

interface PriceChartProps {
  ticker: string;
  data: PricePoint[];
}

function PriceChart({ ticker, data }: PriceChartProps) {
  const options: Highcharts.Options = {
    title: {
      text: `Price History - ${ticker}`,
    },
    xAxis: {
      categories: data.map((point) => point.date),
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Price (USD)",
      },
    },
    series: [
      {
        name: ticker,
        type: "line",
        data: data.map((point) => point.price),
      },
    ],
    tooltip: {
      valuePrefix: "$",
    },
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default PriceChart;
