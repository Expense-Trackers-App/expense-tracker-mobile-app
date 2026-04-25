import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MobileLayout } from "@/components/MobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, formatCurrency } from "@/context/AppContext";
import { CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/types";

export default function Analytics() {
  const { expenses, settings } = useApp();
  const [range, setRange] = useState<"week" | "month" | "year">("month");

  const filtered = useMemo(() => {
    const now = new Date();
    return expenses.filter((e) => {
      const d = new Date(e.date);
      if (range === "week") {
        const diff = (now.getTime() - d.getTime()) / 86400000;
        return diff <= 7;
      }
      if (range === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return d.getFullYear() === now.getFullYear();
    });
  }, [expenses, range]);

  const expensesOnly = filtered.filter((e) => e.amount < 0);
  const total = expensesOnly.reduce((s, e) => s + Math.abs(e.amount), 0);

  const byCategory = useMemo(() => {
    const map = new Map<Category, number>();
    for (const e of expensesOnly) {
      map.set(e.category, (map.get(e.category) ?? 0) + Math.abs(e.amount));
    }
    return Array.from(map.entries())
      .map(([cat, value]) => ({ cat, value, meta: CATEGORIES[cat] }))
      .sort((a, b) => b.value - a.value);
  }, [expensesOnly]);

  const data = byCategory.map((c) => ({ name: c.meta.label, value: c.value, fill: c.meta.hex }));

  return (
    <MobileLayout>
      <AppHeader title="Analytics" />
      <div className="px-5 pb-6 space-y-6">
        <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
          <SelectTrigger className="h-12 bg-secondary/60 border-border/50 rounded-2xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-5">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(total, settings.currency)}</p>
          <p className="text-xs text-success mt-1">+12.5% from last period</p>

          <div className="h-56 mt-4 relative">
            {data.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">No data</div>
            ) : (
              <>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} stroke="none">
                      {data.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                      formatter={(v: number) => formatCurrency(v, settings.currency)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xl font-bold">{formatCurrency(total, settings.currency)}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <div className="space-y-2">
          {byCategory.map((c) => {
            const pct = total ? Math.round((c.value / total) * 100) : 0;
            return (
              <div key={c.cat} className="flex items-center justify-between bg-card rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: c.meta.hex }} />
                  <p className="text-sm font-medium">{c.meta.label}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                  <span className="text-sm font-semibold w-20 text-right">{formatCurrency(c.value, settings.currency)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}