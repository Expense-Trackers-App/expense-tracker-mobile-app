import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { PhoneShell } from "@/components/PhoneShell";
import { StatusBar } from "@/components/StatusBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_LIST } from "@/lib/categories";
import { useApp } from "@/context/AppContext";
import type { Category, PaymentMethod } from "@/lib/types";
import { toast } from "sonner";

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "credit-card", label: "Credit Card" },
  { id: "debit-card", label: "Debit Card" },
  { id: "cash", label: "Cash" },
  { id: "bank-transfer", label: "Bank Transfer" },
];

export default function AddExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addExpense, updateExpense, deleteExpense, expenses } = useApp();
  const editing = useMemo(() => expenses.find((e) => e.id === id), [expenses, id]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [notes, setNotes] = useState("");
  const [isIncome, setIsIncome] = useState(false);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setAmount(Math.abs(editing.amount).toString());
      setCategory(editing.category);
      setDate(editing.date.slice(0, 10));
      setPaymentMethod(editing.paymentMethod);
      setNotes(editing.notes ?? "");
      setIsIncome(editing.amount > 0);
    }
  }, [editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!title.trim()) return toast.error("Add a title");
    if (Number.isNaN(num) || num <= 0) return toast.error("Enter a valid amount");

    const value = isIncome ? num : -num;
    if (editing) {
      updateExpense(editing.id, { title, amount: value, category, date: new Date(date).toISOString(), paymentMethod, notes });
      toast.success("Expense updated");
    } else {
      addExpense({ title, amount: value, category, date: new Date(date).toISOString(), paymentMethod, notes });
      toast.success("Expense added");
    }
    navigate(-1);
  };

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen">
        <StatusBar />
        <AppHeader title={editing ? "Edit Expense" : "Add Expense"} />
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="flex-1 flex flex-col px-5 pb-6 space-y-5"
        >
          <Field label="Amount">
            <div className="flex items-center gap-2 bg-secondary/60 rounded-2xl px-5 h-16">
              <span className="text-2xl font-semibold text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="border-0 bg-transparent text-2xl font-semibold p-0 h-auto focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => setIsIncome(!isIncome)}
                className={`text-xs px-3 py-1 rounded-full ${isIncome ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}
              >
                {isIncome ? "Income" : "Expense"}
              </button>
            </div>
          </Field>

          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Groceries"
              className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5"
            />
          </Field>

          <Field label="Category">
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_LIST.map((c) => {
                  const Icon = c.icon;
                  return (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${c.color}`} />
                        {c.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Date">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5"
            />
          </Field>

          <Field label="Payment Method">
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <SelectTrigger className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="bg-secondary/60 border-border/50 rounded-2xl px-5 py-3 resize-none"
            />
          </Field>

          <div className="flex-1" />
          <div className="space-y-2">
            <Button type="submit" size="lg" className="w-full h-14 gradient-primary border-0 hover:opacity-90 rounded-2xl">
              {editing ? "Save Changes" : "Save Expense"}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl"
                onClick={() => {
                  deleteExpense(editing.id);
                  toast.success("Deleted");
                  navigate(-1);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </motion.form>
      </div>
    </PhoneShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      {children}
    </div>
  );
}