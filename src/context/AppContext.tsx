import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { AppSettings, Budget, Expense, User } from "@/lib/types";
import { toast } from "sonner";

interface AppContextValue {
  user: User | null;
  expenses: Expense[];
  budgets: Budget[];
  settings: AppSettings;
  loading: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addBudget: (b: Omit<Budget, "id">) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_SETTINGS: AppSettings = {
  currency: "USD",
  language: "English",
  darkMode: true,
  notifications: true,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name ?? session.user.email?.split("@")[0] ?? "User",
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name ?? session.user.email?.split("@")[0] ?? "User",
        });
      } else {
        setUser(null);
        setExpenses([]);
        setBudgets([]);
        setSettings(DEFAULT_SETTINGS);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user data when user changes
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      setLoading(true);
      try {
        const [expRes, budRes, setRes] = await Promise.all([
          supabase.from("expenses").select("*").order("date", { ascending: false }),
          supabase.from("budgets").select("*"),
          supabase.from("settings").select("*").maybeSingle()
        ]);

        if (expRes.data) setExpenses(expRes.data as Expense[]);
        if (budRes.data) setBudgets(budRes.data as Budget[]);
        if (setRes.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...setRes.data });
        } else {
          // Create default settings if they don't exist
          await supabase.from("settings").insert({ user_id: user.id, ...DEFAULT_SETTINGS });
        }
      } catch (err: any) {
        console.error("Failed to load user data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  const login = useCallback((email: string, name?: string) => {
    // Rely on Supabase AuthStateChange for setting user
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const addExpense: AppContextValue["addExpense"] = async (e) => {
    if (!user) return;
    const newExpense = { ...e, id: crypto.randomUUID() };
    setExpenses((prev) => [newExpense, ...prev]);
    
    const { error } = await supabase.from("expenses").insert({ ...newExpense, user_id: user.id });
    if (error) toast.error("Failed to save expense: " + error.message);
  };

  const updateExpense: AppContextValue["updateExpense"] = async (id, e) => {
    setExpenses((prev) => prev.map((it) => (it.id === id ? { ...it, ...e } : it)));
    const { error } = await supabase.from("expenses").update(e).eq("id", id);
    if (error) toast.error("Failed to update expense");
  };

  const deleteExpense: AppContextValue["deleteExpense"] = async (id) => {
    setExpenses((prev) => prev.filter((it) => it.id !== id));
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) toast.error("Failed to delete expense");
  };

  const addBudget: AppContextValue["addBudget"] = async (b) => {
    if (!user) return;
    const newBudget = { ...b, id: crypto.randomUUID() };
    setBudgets((prev) => [...prev, newBudget]);
    
    const { error } = await supabase.from("budgets").insert({ ...newBudget, user_id: user.id });
    if (error) toast.error("Failed to save budget: " + error.message);
  };

  const updateBudget: AppContextValue["updateBudget"] = async (id, b) => {
    setBudgets((prev) => prev.map((it) => (it.id === id ? { ...it, ...b } : it)));
    const { error } = await supabase.from("budgets").update(b).eq("id", id);
    if (error) toast.error("Failed to update budget");
  };

  const deleteBudget: AppContextValue["deleteBudget"] = async (id) => {
    setBudgets((prev) => prev.filter((it) => it.id !== id));
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) toast.error("Failed to delete budget");
  };

  const updateSettings: AppContextValue["updateSettings"] = async (s) => {
    if (!user) return;
    setSettings((prev) => ({ ...prev, ...s }));
    const { error } = await supabase.from("settings").update(s).eq("user_id", user.id);
    if (error) toast.error("Failed to save settings");
  };

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      expenses,
      budgets,
      settings,
      loading,
      login,
      logout,
      addExpense,
      updateExpense,
      deleteExpense,
      addBudget,
      updateBudget,
      deleteBudget,
      updateSettings,
    }),
    [user, expenses, budgets, settings, loading, login, logout]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function formatCurrency(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}