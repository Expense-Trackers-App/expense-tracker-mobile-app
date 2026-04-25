import type { Expense, Budget, User, AppSettings } from "./types";

const KEYS = {
  user: "et.user",
  expenses: "et.expenses",
  budgets: "et.budgets",
  settings: "et.settings",
  onboarded: "et.onboarded",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUser: () => read<User | null>(KEYS.user, null),
  setUser: (u: User | null) => (u ? write(KEYS.user, u) : localStorage.removeItem(KEYS.user)),

  getExpenses: () => read<Expense[]>(KEYS.expenses, []),
  setExpenses: (e: Expense[]) => write(KEYS.expenses, e),

  getBudgets: () => read<Budget[]>(KEYS.budgets, []),
  setBudgets: (b: Budget[]) => write(KEYS.budgets, b),

  getSettings: () =>
    read<AppSettings>(KEYS.settings, {
      currency: "USD",
      language: "English",
      darkMode: true,
      notifications: true,
    }),
  setSettings: (s: AppSettings) => write(KEYS.settings, s),

  isOnboarded: () => read<boolean>(KEYS.onboarded, false),
  setOnboarded: (v: boolean) => write(KEYS.onboarded, v),

  reset: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

/** Seed demo data so screens look populated. */
export function seedDemoData(userId: string) {
  const today = new Date();
  const iso = (d: Date) => d.toISOString();
  const day = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    return iso(d);
  };

  const expenses: Expense[] = [
    { id: crypto.randomUUID(), title: "Starbucks", amount: -4.35, category: "food", date: day(0), paymentMethod: "credit-card" },
    { id: crypto.randomUUID(), title: "Uber", amount: -18.6, category: "transport", date: day(1), paymentMethod: "credit-card" },
    { id: crypto.randomUUID(), title: "Electricity Bill", amount: -85.0, category: "bills", date: day(2), paymentMethod: "bank-transfer" },
    { id: crypto.randomUUID(), title: "Salary", amount: 3300, category: "salary", date: day(3), paymentMethod: "bank-transfer" },
    { id: crypto.randomUUID(), title: "Restaurant", amount: -25.6, category: "food", date: day(3), paymentMethod: "credit-card" },
    { id: crypto.randomUUID(), title: "Groceries", amount: -45.3, category: "food", date: day(4), paymentMethod: "debit-card" },
    { id: crypto.randomUUID(), title: "Netflix", amount: -15.99, category: "entertainment", date: day(5), paymentMethod: "credit-card" },
    { id: crypto.randomUUID(), title: "Amazon Order", amount: -89.99, category: "shopping", date: day(6), paymentMethod: "credit-card" },
    { id: crypto.randomUUID(), title: "Gas", amount: -52.0, category: "transport", date: day(7), paymentMethod: "credit-card" },
    { id: crypto.randomUUID(), title: "Internet Bill", amount: -60.0, category: "bills", date: day(8), paymentMethod: "bank-transfer" },
  ];

  const month = today.toISOString().slice(0, 7);
  const budgets: Budget[] = [
    { id: crypto.randomUUID(), category: "food", limit: 800, month },
    { id: crypto.randomUUID(), category: "transport", limit: 400, month },
    { id: crypto.randomUUID(), category: "bills", limit: 300, month },
    { id: crypto.randomUUID(), category: "shopping", limit: 200, month },
    { id: crypto.randomUUID(), category: "entertainment", limit: 150, month },
  ];

  storage.setExpenses(expenses);
  storage.setBudgets(budgets);
  void userId;
}