export const SECTORS = [
  { value: "Health", label: "Health" },
  { value: "Education", label: "Education" },
  { value: "Welfare", label: "Welfare" },
  { value: "Infrastructure", label: "Infrastructure" },
];

export const INCOME_GROUPS = [
  { value: "Low", label: "Low Income" },
  { value: "Middle", label: "Middle Income" },
  { value: "High", label: "High Income" },
];

export const PAYER_TYPES = [
  { value: "Individual", label: "Individual" },
  { value: "Corporate", label: "Corporate" },
];

export const TAX_TYPES = [
  { value: "Income", label: "Income" },
  { value: "VAT", label: "VAT" },
  { value: "Corporate", label: "Corporate" },
];

export const INCOME_BRACKETS = [
  { value: "Low", label: "Low Income" },
  { value: "Medium", label: "Medium Income" },
  { value: "High", label: "High Income" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount_high", label: "Highest Amount" },
  { value: "amount_low", label: "Lowest Amount" },
];

export const PAGINATION_LIMITS = [10, 25, 50, 100];

export const YEAR_OPTIONS = Array.from({ length: 20 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return String(year);
});

export const FALLBACK_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "INR",
  "AUD",
  "CAD",
  "SGD",
  "AED",
];

export const POPULAR_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "INR",
  "AUD",
  "CAD",
  "SGD",
  "AED",
];
