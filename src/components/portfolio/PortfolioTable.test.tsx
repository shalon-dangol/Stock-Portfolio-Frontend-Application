import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PortfolioTable from "./PortfolioTable";
import type { Stock } from "../../types/stock";

const stocks: Stock[] = [
  { id: "1", ticker: "NABIL", companyName: "Nabil Bank Limited", quantity: 10, purchasePrice: 520, currentPrice: 545, purchaseDate: "2024-01-15" },
  { id: "2", ticker: "NICA", companyName: "NIC Asia Bank Limited", quantity: 5, purchasePrice: 410, currentPrice: 425, purchaseDate: "2024-02-20" },
];

describe("PortfolioTable", () => {
  it("renders holdings andgain/loss", () => {
    render(<PortfolioTable stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("NABIL")).toBeInTheDocument();
    expect(screen.getByText("NIC Asia Bank Limited")).toBeInTheDocument();
    // gain/loss = (545-520)*10=250 (NPR with NBSP)
    expect(screen.getByText(/250\.00/)).toBeInTheDocument();
  });

  it("calls onEdit and onDelete", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<PortfolioTable stocks={stocks} onEdit={onEdit} onDelete={onDelete} />);
    await user.click(screen.getByLabelText("Edit NABIL"));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ ticker: "NABIL" }));
    await user.click(screen.getByLabelText("Delete NICA"));
    expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ ticker: "NICA" }));
  });

  it("filters stocks", async () => {
    const user = userEvent.setup();
    render(<PortfolioTable stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const input = screen.getByLabelText("Filter stocks");
    await user.type(input, "nica");
    expect(screen.queryByText("NABIL")).not.toBeInTheDocument();
    expect(screen.getByText("NICA")).toBeInTheDocument();
  });

  it("sorts by ticker", async () => {
    const user = userEvent.setup();
    render(<PortfolioTable stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} />);
    // Click Ticker header sort label
    await user.click(screen.getByText("Ticker"));
    // After sorting asc, NABIL before NICA still; click again for desc
    await user.click(screen.getByText("Ticker"));
    const rows = screen.getAllByRole("row");
    // header row + 2 data rows; first data row should now be NICA when desc
    expect(rows[1].textContent).toContain("NICA");
  });

  it("shows empty state", () => {
    render(<PortfolioTable stocks={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("No stocks found.")).toBeInTheDocument();
  });
});
