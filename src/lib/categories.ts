import { Coffee, Car, Receipt, ShoppingBag, Film, Wallet, MoreHorizontal, type LucideIcon } from "lucide-react";
import type { Category } from "./types";

export interface CategoryMeta {
  id: Category;
  label: string;
  icon: LucideIcon;
  color: string; // tailwind class
  bg: string;
  hex: string;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  food: { id: "food", label: "Food & Drink", icon: Coffee, color: "text-orange-400", bg: "bg-orange-500/15", hex: "#fb923c" },
  transport: { id: "transport", label: "Transport", icon: Car, color: "text-sky-400", bg: "bg-sky-500/15", hex: "#38bdf8" },
  bills: { id: "bills", label: "Bills & Utilities", icon: Receipt, color: "text-yellow-400", bg: "bg-yellow-500/15", hex: "#facc15" },
  shopping: { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "text-pink-400", bg: "bg-pink-500/15", hex: "#f472b6" },
  entertainment: { id: "entertainment", label: "Entertainment", icon: Film, color: "text-purple-400", bg: "bg-purple-500/15", hex: "#c084fc" },
  salary: { id: "salary", label: "Salary", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/15", hex: "#34d399" },
  others: { id: "others", label: "Others", icon: MoreHorizontal, color: "text-slate-400", bg: "bg-slate-500/15", hex: "#94a3b8" },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);