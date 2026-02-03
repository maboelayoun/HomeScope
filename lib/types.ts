// Home Sharing Expense Tracker Types

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  category: ExpenseCategory;
  date: string;
  splitBetween: string[]; // Member IDs
  notes?: string;
}

export type ExpenseCategory = 
  | "food"
  | "groceries"
  | "gas"
  | "utilities"
  | "rent"
  | "internet"
  | "household"
  | "entertainment"
  | "other";

export interface Balance {
  memberId: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number; // positive = owed money, negative = owes money
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

export interface Home {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

export const CATEGORY_INFO: Record<ExpenseCategory, { label: string; icon: string }> = {
  food: { label: "Food & Dining", icon: "utensils" },
  groceries: { label: "Groceries", icon: "shopping-cart" },
  gas: { label: "Gas & Fuel", icon: "fuel" },
  utilities: { label: "Utilities", icon: "zap" },
  rent: { label: "Rent", icon: "home" },
  internet: { label: "Internet & Phone", icon: "wifi" },
  household: { label: "Household Items", icon: "package" },
  entertainment: { label: "Entertainment", icon: "tv" },
  other: { label: "Other", icon: "more-horizontal" },
};

export const MEMBER_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];
