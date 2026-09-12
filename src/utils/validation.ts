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

  // Quantity must be numeric and greater than zero
  const quantity = Number(values.quantity);
  if (!values.quantity.trim()) {
    errors.quantity = "Quantity is required";
  } else if (isNaN(quantity) || quantity <= 0) {
    errors.quantity = "Quantity must be a number greater than zero";
  }

  // Purchase price must be numeric and non-negative
  const price = Number(values.purchasePrice);
  if (!values.purchasePrice.trim()) {
    errors.purchasePrice = "Purchase price is required";
  } else if (isNaN(price) || price < 0) {
    errors.purchasePrice = "Purchase price must be a non-negative number";
  }

  // Date of purchase must be a valid date
  if (!values.purchaseDate) {
    errors.purchaseDate = "Purchase date is required";
  } else if (isNaN(Date.parse(values.purchaseDate))) {
    errors.purchaseDate = "Please enter a valid date";
  }

  return errors;
}

// Check if the form has any validation errors
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
