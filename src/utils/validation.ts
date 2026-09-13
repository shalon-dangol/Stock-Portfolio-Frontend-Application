import type { StockFormValues } from "../types/stock";

// Form validation rules from PRD Section 5.5
// Returns an object with error messages keyed by field name

export interface ValidationErrors {
  ticker?: string;
  companyName?: string;
  quantity?: string;
  purchasePrice?: string;
  purchaseDate?: string;
}

export function validateStockForm(values: StockFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  // Ticker cannot be empty
  if (!values.ticker.trim()) {
    errors.ticker = "Ticker symbol is required";
  }

  // Company name cannot be empty
  if (!values.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  // Quantity must be integer > 0
  const quantity = Number(values.quantity);
  if (!values.quantity.trim()) {
    errors.quantity = "Quantity is required";
  } else if (!Number.isFinite(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
    errors.quantity = "Quantity must be a whole number greater than zero";
  }

  // Purchase price must be numeric and non-negative
  const price = Number(values.purchasePrice);
  if (!values.purchasePrice.trim()) {
    errors.purchasePrice = "Purchase price is required";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.purchasePrice = "Purchase price must be a non-negative number";
  }

  // Date of purchase must be a valid date (strict YYYY-MM-DD, no overflow)
  if (!values.purchaseDate) {
    errors.purchaseDate = "Purchase date is required";
  } else if (isNaN(Date.parse(values.purchaseDate)) || !isValidDateString(values.purchaseDate)) {
    errors.purchaseDate = "Please enter a valid date";
  }

  return errors;
}

function isValidDateString(value: string): boolean {
  // Enforce YYYY-MM-DD and disallow overflow like 2024-02-30 -> 2024-03-01
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  return d.toISOString().slice(0, 10) === value;
}

// Check if the form has any validation errors
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
