import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PortfolioTable from "./PortfolioTable";
import type { Stock } from "../../types/stock";

const stocks: Stock[] = [
  { id: "1", ticker: "AAPL", companyName: "Apple Inc.", quantity: 10, purchasePrice: 150, currentPrice: 175, purchaseDate: "2024-01-15" },
  { id: "2", ticker: "MSFT", companyName: "Microsoft", quantity: 5, purchasePrice: 280, currentPrice: 310, purchaseDate: "2024-02-20" },
];

describe("PortfolioTable", () => {
  it("renders holdings andgain/loss", () => {
    render(<PortfolioTable stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
    // gain/loss = (175-150)*10=250
    expect(screen.getByText("$250.00")).toBeInTheDocument();
  });

  it("calls onEdit and onDelete", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<PortfolioTable stocks={stocks} onEdit={onEdit} onDelete={onDelete} />);
    await user.click(screen.getByLabelText("Edit AAPL"));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ ticker: "AAPL" }));
    await user.click(screen.getByLabelText("Delete MSFT"));
    expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ ticker: "MSFT" }));
  });

  it("filters stocks", async () => {
    const user = userEvent.setup();
    render(<PortfolioTable stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const input = screen.getByLabelText("Filter stocks");
    await user.type(input, "msft");
    expect(screen.queryByText("AAPL")).not.toBeInTheDocument();
    expect(screen.getByText("MSFT")).toBeInTheDocument();
  });

  it("sorts by ticker", async () => {
    const user = userEvent.setup();
    render(<PortfolioTable stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    // Click Ticker header sort label
    await user.click(screen.getByText("Ticker"));
    // After sorting asc, AAPL before MSFT still; click again for desc
    await user.click(screen.getByText("Ticker"));
    const rows = screen.getAllByRole("row");
    // header row + 2 data rows; first data row should now be MSFT when desc
    expect(rows[1].textContent).toContain("MSFT");
  });

  it("shows empty state", () => {
    render(<PortfolioTable stocks={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("No stocks found.")).toBeInTheDocument();
  });
});
