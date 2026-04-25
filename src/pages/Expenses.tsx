import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { useApp, formatCurrency } from "@/context/AppContext";
import { CATEGORIES } from "@/lib/categories";
import { toast } from "sonner";

type Filter = "all" | "income" | "expense";

export default function Expenses() {
  const navigate = useNavigate();
  const { expenses, settings } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => {
        if (filter === "income" && e.amount <= 0) return false;
        if (filter === "expense" && e.amount >= 0) return false;
        if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [expenses, filter, query]);

  const exportCsv = () => {
    if (filtered.length === 0) return toast.error("No transactions to export");
    const headers = ["Date,Title,Category,Amount"];
    const rows = filtered.map(
      (e) => `${new Date(e.date).toISOString().split("T")[0]},"${e.title}",${CATEGORIES[e.category].label},${e.amount}`
    );
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pocketwise-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const e of filtered) {
      const key = new Date(e.date).toDateString();
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <MobileLayout>
      <AppHeader title="Expenses" />
      <div className="px-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              className="h-12 pl-11 bg-secondary/60 border-border/50 rounded-2xl"
            />
          </div>
          <button onClick={exportCsv} className="h-12 w-12 rounded-2xl bg-secondary/60 flex items-center justify-center hover:bg-secondary/80 transition">
            <Download className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-2">
          {(["all", "income", "expense"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 h-9 text-sm rounded-full transition capitalize ${
                filter === f ? "gradient-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Total {filter === "all" ? "Balance" : filter === "income" ? "Income" : "Expense"}
          </p>
          <p className={`text-2xl font-bold mt-1 ${total < 0 ? "text-foreground" : "text-success"}`}>
            {formatCurrency(total, settings.currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">+12.5% vs last month</p>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-5 pb-4">
        {groups.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No transactions found</p>
        ) : (
          groups.map(([date, items], idx) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2">{formatGroupDate(date)}</p>
              <div className="space-y-2">
                {items.map((tx) => {
                  const cat = CATEGORIES[tx.category];
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
                        <p className="text-xs text-muted-foreground">{cat.label}</p>
                      </div>
                      <p className={`text-sm font-semibold ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                        {tx.amount > 0 ? "+" : ""}
                        {formatCurrency(tx.amount, settings.currency)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </MobileLayout>
  );
}

function formatGroupDate(d: string) {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}