import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StockFormDialog from "./StockFormDialog";

describe("StockFormDialog", () => {
  it("validates and blocks submit on empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<StockFormDialog open onClose={vi.fn()} onSubmit={onSubmit} editingStock={null} />);
    await user.click(screen.getByRole("button", { name: "Add Stock" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Ticker symbol is required")).toBeInTheDocument();
  });

  it("submits valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<StockFormDialog open onClose={onClose} onSubmit={onSubmit} editingStock={null} />);
    await user.type(screen.getByLabelText("Ticker Symbol"), "NVDA");
    await user.type(screen.getByLabelText("Company Name"), "NVIDIA");
    await user.type(screen.getByLabelText("Quantity"), "5");
    await user.type(screen.getByLabelText("Purchase Price (NPR)"), "400");
    // date input
    await user.type(screen.getByLabelText("Purchase Date"), "2024-05-01");
    await user.click(screen.getByRole("button", { name: "Add Stock" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ ticker: "NVDA", companyName: "NVIDIA" }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("prefills when editing", () => {
    render(
      <StockFormDialog
        open
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        editingStock={{
          id: "1",
          ticker: "AAPL",
          companyName: "Apple Inc.",
          quantity: 10,
          purchasePrice: 150,
          currentPrice: 175,
          purchaseDate: "2024-01-15",
        }}
      />,
    );
    expect(screen.getByDisplayValue("AAPL")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Apple Inc.")).toBeInTheDocument();
  });
});
