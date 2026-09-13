const nprFormatter = new Intl.NumberFormat("en-NP", {
  style: "currency",
  currency: "NPR",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNPR(value: number): string {
  if (!Number.isFinite(value)) return "—";
  try {
    return nprFormatter.format(value);
  } catch {
    // Fallback if en-NP not available (some Node/jsdom ICU builds)
    return `NPR ${value.toFixed(2)}`;
  }
}
