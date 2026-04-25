import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/MobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, formatCurrency } from "@/context/AppContext";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/categories";
import type { Category } from "@/lib/types";
import { toast } from "sonner";

export default function Budgets() {
  const navigate = useNavigate();
  const { budgets, expenses, settings, addBudget } = useApp();
  const [monthOffset, setMonthOffset] = useState(0);
  const [open, setOpen] = useState(false);

  const date = new Date();
  date.setMonth(date.getMonth() + monthOffset);
  const monthKey = date.toISOString().slice(0, 7);
  const monthLabel = date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const monthBudgets = useMemo(() => budgets.filter((b) => b.month === monthKey), [budgets, monthKey]);

  const spentByCat = useMemo(() => {
    const map = new Map<Category, number>();
    for (const e of expenses) {
      if (e.amount >= 0) continue;
      const k = new Date(e.date).toISOString().slice(0, 7);
      if (k !== monthKey) continue;
      map.set(e.category, (map.get(e.category) ?? 0) + Math.abs(e.amount));
    }
    return map;
  }, [expenses, monthKey]);

  return (
    <MobileLayout>
      <AppHeader
        title="Budgets"
        right={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="h-10 w-10 grid place-items-center rounded-full bg-secondary/60 hover:bg-secondary transition" aria-label="Refresh">
                <RefreshCw className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <NewBudgetDialog
              monthKey={monthKey}
              existing={monthBudgets.map((b) => b.category)}
              onCreate={(cat, limit) => {
                addBudget({ category: cat, limit, month: monthKey });
                toast.success("Budget added");
                setOpen(false);
              }}
            />
          </Dialog>
        }
      />

      <div className="px-5 pb-6 space-y-4">
        <div className="flex items-center justify-between bg-card rounded-2xl px-4 py-3">
          <button onClick={() => setMonthOffset((m) => m - 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold">{monthLabel}</p>
          <button onClick={() => setMonthOffset((m) => m + 1)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {monthBudgets.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No budgets for this month yet</p>
        ) : (
          monthBudgets.map((b, idx) => {
            const cat = CATEGORIES[b.category];
            const spent = spentByCat.get(b.category) ?? 0;
            const pct = Math.min(Math.round((spent / b.limit) * 100), 100);
            const overLimit = spent > b.limit;
            return (
              <motion.button
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => navigate(`/budget/${b.id}`)}
                className="w-full bg-card rounded-2xl p-4 text-left hover:bg-card/80 transition"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{cat.label}</p>
                  <span className={`text-xs ${overLimit ? "text-destructive" : "text-muted-foreground"}`}>{pct}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(spent, settings.currency)} / {formatCurrency(b.limit, settings.currency)}
                </p>
                <div className="h-2 bg-muted rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: overLimit ? "hsl(var(--destructive))" : cat.hex }}
                  />
                </div>
              </motion.button>
            );
          })
        )}

        <Button
          onClick={() => setOpen(true)}
          className="w-full h-14 gradient-primary border-0 hover:opacity-90 rounded-2xl mt-2"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Budget
        </Button>
      </div>
    </MobileLayout>
  );
}

function NewBudgetDialog({
  monthKey,
  existing,
  onCreate,
}: {
  monthKey: string;
  existing: Category[];
  onCreate: (cat: Category, limit: number) => void;
}) {
  const available = CATEGORY_LIST.filter((c) => !existing.includes(c.id) && c.id !== "salary");
  const [cat, setCat] = useState<Category>(available[0]?.id ?? "food");
  const [limit, setLimit] = useState("");

  return (
    <DialogContent className="rounded-3xl">
      <DialogHeader>
        <DialogTitle>New Budget · {monthKey}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-2">
        <Select value={cat} onValueChange={(v) => setCat(v as Category)}>
          <SelectTrigger className="h-12 bg-secondary/60 border-border/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {available.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Limit (e.g. 500)"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="h-12 bg-secondary/60 border-border/50 rounded-xl"
        />
        <Button
          onClick={() => {
            const n = parseFloat(limit);
            if (!Number.isFinite(n) || n <= 0) return toast.error("Enter a valid amount");
            onCreate(cat, n);
          }}
          className="w-full h-12 gradient-primary border-0 rounded-xl"
        >
          Create Budget
        </Button>
      </div>
    </DialogContent>
  );
}