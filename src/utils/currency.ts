export function formatNPR(value: number): string {
  return value.toLocaleString("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
