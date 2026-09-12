import { useMemo, useState } from "react";
import {
  coreFeatures,
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Stock } from "../../types/stock";

interface PortfolioTableProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
}

const features = tableFeatures({
  ...coreFeatures,
});

const columnHelper = createColumnHelper<typeof features, Stock>();

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function calculateGainLoss(stock: Stock): number {
  return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
}

type SortField = "ticker" | "companyName" | "quantity" | "purchasePrice" | "currentPrice" | null;
type SortDir = "asc" | "desc";

function PortfolioTable({ stocks, onEdit, onDelete }: PortfolioTableProps) {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const filteredAndSorted = useMemo(() => {
    let result = stocks;
    if (filter.trim()) {
      const q = filter.toLowerCase();
      result = result.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q),
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField];
        const bv = b[sortField];
        let cmp = 0;
        if (typeof av === "string" && typeof bv === "string") {
          cmp = av.localeCompare(bv);
        } else {
          cmp = (av as number) - (bv as number);
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [stocks, filter, sortField, sortDir]);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("ticker", {
          header: "Ticker",
          cell: (info) => (
            <Typography sx={{ fontWeight: "bold" }}>
              {info.getValue()}
            </Typography>
          ),
        }),
        columnHelper.accessor("companyName", {
          header: "Company",
        }),
        columnHelper.accessor("quantity", {
          header: "Quantity",
          cell: (info) => info.getValue().toLocaleString(),
        }),
        columnHelper.accessor("purchasePrice", {
          header: "Purchase Price",
          cell: (info) => formatCurrency(info.getValue()),
        }),
        columnHelper.accessor("currentPrice", {
          header: "Current Price",
          cell: (info) => formatCurrency(info.getValue()),
        }),
        columnHelper.display({
          id: "gainLoss",
          header: "Gain / Loss",
          cell: (info) => {
            const stock = info.row.original;
            const gainLoss = calculateGainLoss(stock);
            const color = gainLoss >= 0 ? "success.main" : "error.main";
            return (
              <Typography color={color} sx={{ fontWeight: "medium" }}>
                {formatCurrency(gainLoss)}
              </Typography>
            );
          },
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: (info) => {
            const stock = info.row.original;
            return (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(stock)}
                  aria-label={`Edit ${stock.ticker}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(stock)}
                  aria-label={`Delete ${stock.ticker}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          },
        }),
      ]),
    [onEdit, onDelete],
  );

  const table = useTable({
    features,
    columns,
    data: filteredAndSorted,
  });

  const sortable: Record<string, SortField> = {
    ticker: "ticker",
    companyName: "companyName",
    quantity: "quantity",
    purchasePrice: "purchasePrice",
    currentPrice: "currentPrice",
  };

  return (
    <Box>
      <TextField
        label="Filter stocks"
        placeholder="Search ticker or company..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        size="small"
        sx={{ mb: 2, minWidth: 260 }}
        slotProps={{ htmlInput: { "aria-label": "Filter stocks" } }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const field = sortable[header.column.id] ?? null;
                  const isSortable = !!field;
                  const active = sortField === field;
                  return (
                    <TableCell
                      key={header.id}
                      sortDirection={active ? sortDir : false}
                    >
                      {header.isPlaceholder ? null : isSortable ? (
                        <TableSortLabel
                          active={active}
                          direction={active ? sortDir : "asc"}
                          onClick={() => handleSort(field)}
                        >
                          {table.FlexRender({ header: header })}
                        </TableSortLabel>
                      ) : (
                        table.FlexRender({ header: header })
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No stocks found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {table.FlexRender({ cell: cell })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PortfolioTable;
