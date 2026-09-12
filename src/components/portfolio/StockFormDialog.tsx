import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { Stock, StockFormValues } from "../../types/stock";
import {
  hasErrors,
  validateStockForm,
  type ValidationErrors,
} from "../../utils/validation";

// Modal dialog for adding a new stock or editing an existing one
// Uses the same form for both operations - the "editing" prop controls the title
// The parent uses a "key" prop to remount this component when opening,
// which resets the form state automatically

interface StockFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: StockFormValues) => void;
  editingStock: Stock | null;
}

// Build initial form values from the stock being edited (or empty for new stock)
function buildInitialValues(editingStock: Stock | null): StockFormValues {
  if (editingStock) {
    return {
      ticker: editingStock.ticker,
      companyName: editingStock.companyName,
      quantity: String(editingStock.quantity),
      purchasePrice: String(editingStock.purchasePrice),
      purchaseDate: editingStock.purchaseDate,
    };
  }
  return {
    ticker: "",
    companyName: "",
    quantity: "",
    purchasePrice: "",
    purchaseDate: "",
  };
}

function StockFormDialog({
  open,
  onClose,
  onSubmit,
  editingStock,
}: StockFormDialogProps) {
  const [formValues, setFormValues] = useState<StockFormValues>(() =>
    buildInitialValues(editingStock),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Update a single field in the form
  function handleFieldChange(field: keyof StockFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  // Validate the form and submit if there are no errors
  function handleSubmit() {
    const validationErrors = validateStockForm(formValues);
    setErrors(validationErrors);

    if (!hasErrors(validationErrors)) {
      onSubmit(formValues);
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editingStock ? `Edit ${editingStock.ticker}` : "Add Stock"}
      </DialogTitle>
      <DialogContent>
        {/* Ticker symbol */}
        <TextField
          label="Ticker Symbol"
          value={formValues.ticker}
          onChange={(event) => handleFieldChange("ticker", event.target.value)}
          error={Boolean(errors.ticker)}
          helperText={errors.ticker}
          fullWidth
          margin="normal"
          disabled={Boolean(editingStock)}
        />

        {/* Company name */}
        <TextField
          label="Company Name"
          value={formValues.companyName}
          onChange={(event) =>
            handleFieldChange("companyName", event.target.value)
          }
          error={Boolean(errors.companyName)}
          helperText={errors.companyName}
          fullWidth
          margin="normal"
        />

        {/* Quantity */}
        <TextField
          label="Quantity"
          type="number"
          value={formValues.quantity}
          onChange={(event) =>
            handleFieldChange("quantity", event.target.value)
          }
          error={Boolean(errors.quantity)}
          helperText={errors.quantity}
          fullWidth
          margin="normal"
        />

        {/* Purchase price */}
        <TextField
          label="Purchase Price (USD)"
          type="number"
          value={formValues.purchasePrice}
          onChange={(event) =>
            handleFieldChange("purchasePrice", event.target.value)
          }
          error={Boolean(errors.purchasePrice)}
          helperText={errors.purchasePrice}
          fullWidth
          margin="normal"
        />

        {/* Purchase date */}
        <TextField
          label="Purchase Date"
          type="date"
          value={formValues.purchaseDate}
          onChange={(event) =>
            handleFieldChange("purchaseDate", event.target.value)
          }
          error={Boolean(errors.purchaseDate)}
          helperText={errors.purchaseDate}
          fullWidth
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingStock ? "Save Changes" : "Add Stock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockFormDialog;
