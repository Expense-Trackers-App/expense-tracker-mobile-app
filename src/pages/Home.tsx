import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, BarChart3, PiggyBank, Plus, User, RefreshCw } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { useApp, formatCurrency } from "@/context/AppContext";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  const navigate = useNavigate();
  const { user, expenses, settings } = useApp();

  const now = new Date();
  const thisMonth = expenses.filter((e) => new Date(e.date).getMonth() === now.getMonth() && new Date(e.date).getFullYear() === now.getFullYear());
  const income = thisMonth.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const expense = Math.abs(thisMonth.filter((e) => e.amount < 0).reduce((s, e) => s + e.amount, 0));
  const balance = expenses.reduce((s, e) => s + e.amount, 0);

  const thisMonthBalance = thisMonth.reduce((s, e) => s + e.amount, 0);
  const lastMonthTotalBalance = balance - thisMonthBalance;
  let percentageChange = 0;
  if (lastMonthTotalBalance !== 0) {
    percentageChange = ((balance - lastMonthTotalBalance) / Math.abs(lastMonthTotalBalance)) * 100;
  } else if (balance > 0) {
    percentageChange = 100;
  } else if (balance < 0) {
    percentageChange = -100;
  }
  const percentageText = `${percentageChange >= 0 ? "+" : ""}${percentageChange.toFixed(1)}% vs last month`;

  const recent = expenses.slice(0, 4);

  return (
    <MobileLayout>
      <div className="px-5 pt-2 pb-6 space-y-6">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Hi, {user?.name?.split(" ")[0] ?? "there"} 👋</p>
            <p className="text-xs text-muted-foreground/70">Good to see you again</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.location.reload()} className="h-10 w-10 rounded-full bg-secondary grid place-items-center">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => navigate("/settings")} className="h-10 w-10 rounded-full bg-secondary grid place-items-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 gradient-primary glow-primary text-primary-foreground"
        >
          <p className="text-xs opacity-80">Total Balance</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-3xl font-bold">{formatCurrency(balance, settings.currency)}</p>
            <span className="text-xs bg-white/15 rounded-full px-2 py-1">{percentageText}</span>
          </div>
        </motion.div>

        {/* Summary */}
        <div>
          <p className="text-sm font-semibold mb-3">This Month Summary</p>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="Income" value={formatCurrency(income, settings.currency)} kind="income" />
            <SummaryCard label="Expense" value={formatCurrency(expense, settings.currency)} kind="expense" />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="text-sm font-semibold mb-3">Quick Actions</p>
          <div className="grid grid-cols-4 gap-3">
            <QuickAction icon={Plus} label="Add Expense" onClick={() => navigate("/expense/new")} active />
            <QuickAction icon={PiggyBank} label="Add Budget" onClick={() => navigate("/budgets")} />
            <QuickAction icon={BarChart3} label="Analytics" onClick={() => navigate("/analytics")} />
            <QuickAction icon={User} label="More" onClick={() => navigate("/settings")} />
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Recent Transactions</p>
            <button onClick={() => navigate("/expenses")} className="text-xs text-primary">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
            ) : (
              recent.map((tx) => {
                const cat = CATEGORIES[tx.category] || CATEGORIES.others;
                const Icon = cat.icon;
                return (
                  <div key={tx.id} className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3">
                    <div className={`h-10 w-10 rounded-full grid place-items-center ${cat.bg}`}>
                      <Icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{tx.title}</p>
                      <p className="text-xs text-muted-foreground">{cat.label}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                        {tx.amount > 0 ? "+" : ""}
                        {formatCurrency(tx.amount, settings.currency)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function SummaryCard({ label, value, kind }: { label: string; value: string; kind: "income" | "expense" }) {
  const Icon = kind === "income" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="bg-card rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <div className={`h-7 w-7 rounded-full grid place-items-center ${kind === "income" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-lg font-bold mt-2">{value}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, active }: { icon: typeof Plus; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className={`h-12 w-12 rounded-2xl grid place-items-center transition ${active ? "gradient-primary text-primary-foreground" : "bg-card text-foreground group-hover:bg-secondary"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
    </button>
  );
}