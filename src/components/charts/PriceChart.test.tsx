import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import PriceChart from "./PriceChart";
import VolumeChart from "./VolumeChart";

// Highcharts renders via div; just ensure props are accepted and component mounts
describe("PriceChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <PriceChart ticker="AAPL" data={[{ date: "2024-01-01", price: 100 }, { date: "2024-01-02", price: 105 }]} />,
    );
    expect(container).toBeTruthy();
  });

  it("updates when data changes", () => {
    const { rerender, container } = render(
      <PriceChart ticker="AAPL" data={[{ date: "2024-01-01", price: 100 }]} />,
    );
    rerender(<PriceChart ticker="AAPL" data={[{ date: "2024-01-01", price: 100 }, { date: "2024-01-02", price: 110 }]} />);
    expect(container).toBeTruthy();
  });
});

describe("VolumeChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <VolumeChart ticker="AAPL" data={[{ date: "2024-01-01", volume: 1000 }]} />,
    );
    expect(container).toBeTruthy();
  });
});
