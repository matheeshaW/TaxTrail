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


export const SECTOR_VALUES = SECTORS.map((s) => s.value);

export const SOCIAL_PROGRAM_TARGET_GROUP_VALUES = [
  "Low Income",
  "Middle Income",
  "Rural",
  "Urban Poor",
  "Disabled",
];

export const SOCIAL_PROGRAM_TARGET_GROUPS = SOCIAL_PROGRAM_TARGET_GROUP_VALUES.map(
  (value) => ({ value, label: value }),
);

export const SOCIAL_PROGRAM_YEAR_MIN = 1900;
export const SOCIAL_PROGRAM_PROGRAM_NAME_MAX_LENGTH = 100;
export const SOCIAL_PROGRAM_BUDGET_MAX = 1_000_000_000;
export const SOCIAL_PROGRAM_BUDGET_PER_BENEFICIARY_MAX = 1_000_000;
