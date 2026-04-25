import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { PhoneShell } from "@/components/PhoneShell";
import { StatusBar } from "@/components/StatusBar";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useApp, formatCurrency } from "@/context/AppContext";
import { CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function BudgetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { budgets, expenses, settings, deleteBudget, updateBudget } = useApp();
  const budget = useMemo(() => budgets.find((b) => b.id === id), [budgets, id]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLimit, setEditLimit] = useState("");

  const handleDelete = () => {
    if (!budget) return;
    deleteBudget(budget.id);
    toast.success("Budget deleted successfully");
    navigate("/budgets", { replace: true });
  };

  const handleEdit = () => {
    if (!budget) return;
    const n = parseFloat(editLimit);
    if (!Number.isFinite(n) || n <= 0) return toast.error("Enter a valid amount");
    updateBudget(budget.id, { limit: n });
    setIsEditOpen(false);
    toast.success("Budget updated successfully");
  };

  if (!budget) {
    return (
      <PhoneShell>
        <div className="flex flex-col min-h-screen">
          <StatusBar />
          <AppHeader title="Budget" />
          <div className="flex-1 grid place-items-center text-muted-foreground">Not found</div>
        </div>
      </PhoneShell>
    );
  }

  const cat = CATEGORIES[budget.category];
  const txns = expenses
    .filter((e) => e.category === budget.category && e.amount < 0 && new Date(e.date).toISOString().slice(0, 7) === budget.month)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const spent = txns.reduce((s, e) => s + Math.abs(e.amount), 0);
  const pct = Math.min(Math.round((spent / budget.limit) * 100), 100);
  const overLimit = spent > budget.limit;
  const nearLimit = pct >= 80;

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen">
        <StatusBar />
        <AppHeader title="Budget Details" />
        <div className="px-5 pb-6 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 text-primary-foreground"
            style={{ background: `linear-gradient(135deg, ${cat.hex}, ${cat.hex}cc)` }}
          >
            <p className="text-base font-semibold">{cat.label}</p>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(spent, settings.currency)} <span className="text-base opacity-80">/ {formatCurrency(budget.limit, settings.currency)}</span>
            </p>
            <div className="h-2 bg-white/25 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs mt-2 opacity-90">{pct}% used</p>
          </motion.div>

          <div>
            <p className="text-sm font-semibold mb-3">Transactions</p>
            <div className="space-y-2">
              {txns.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No transactions yet</p>
              ) : (
                txns.map((tx) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={tx.id}
                      onClick={() => navigate(`/expense/${tx.id}`)}
                      className="w-full flex items-center gap-3 bg-card rounded-2xl px-4 py-3 text-left hover:bg-card/80 transition"
                    >
                      <div className={`h-10 w-10 rounded-full grid place-items-center ${cat.bg}`}>
                        <Icon className={`h-5 w-5 ${cat.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{tx.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(tx.amount, settings.currency)}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {nearLimit && (
            <div>
              <p className="text-sm font-semibold mb-3">Budget Alerts</p>
              <div className={`flex items-center gap-3 rounded-2xl p-4 ${overLimit ? "bg-destructive/10 border border-destructive/30" : "bg-warning/10 border border-warning/30"}`}>
                <AlertTriangle className={`h-5 w-5 ${overLimit ? "text-destructive" : "text-warning"}`} />
                <p className="text-xs">
                  {overLimit
                    ? `You exceeded your ${cat.label} budget by ${formatCurrency(spent - budget.limit, settings.currency)}.`
                    : `You are close to reaching your budget limit for ${cat.label}.`}
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => {
              setEditLimit(budget.limit.toString());
              setIsEditOpen(true);
            }}>
              Edit Limit
            </Button>
            <Button variant="destructive" className="w-full h-12 rounded-xl" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Edit Budget Limit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input
                type="number"
                placeholder="New Limit (e.g. 500)"
                value={editLimit}
                onChange={(e) => setEditLimit(e.target.value)}
                className="h-12 bg-secondary/60 border-border/50 rounded-xl"
              />
              <Button onClick={handleEdit} className="w-full h-12 gradient-primary border-0 rounded-xl">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <BottomNav />
      </div>
    </PhoneShell>
  );
}