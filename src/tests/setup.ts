// Test setup for Vitest
import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// jsdom polyfills for Highcharts
if (typeof window !== "undefined" && !window.CSS?.supports) {
  // @ts-expect-error polyfill
  window.CSS = { supports: () => false };
}

// Mock HighchartsReact to avoid heavy Highcharts rendering in jsdom
vi.mock("highcharts-react-official", () => ({
  default: ({ options }: { options: { title?: { text?: string } } }) =>
    React.createElement("div", { "data-testid": "highcharts-mock" }, options?.title?.text ?? "chart"),
}));
