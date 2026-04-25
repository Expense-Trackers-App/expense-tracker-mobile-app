export type Category =
  | "food"
  | "transport"
  | "bills"
  | "shopping"
  | "entertainment"
  | "salary"
  | "others";

export type PaymentMethod = "credit-card" | "debit-card" | "cash" | "bank-transfer";

export interface Expense {
  id: string;
  title: string;
  amount: number; // positive = income, negative = expense
  category: Category;
  date: string; // ISO
  notes?: string;
  paymentMethod: PaymentMethod;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  month: string; // YYYY-MM
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppSettings {
  currency: string;
  language: string;
  darkMode: boolean;
  notifications: boolean;
}