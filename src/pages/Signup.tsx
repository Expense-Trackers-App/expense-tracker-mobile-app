import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneShell } from "@/components/PhoneShell";
import { StatusBar } from "@/components/StatusBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name || !email || !password)
    return toast.error("Please fill in all fields");

  if (password !== confirm)
    return toast.error("Passwords do not match");

  if (!agreed)
    return toast.error("Please accept the terms");

  // 🔥 Supabase signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  // OPTIONAL: store name in your database later
  // (Supabase auth only stores email/password by default)

  login(email, name);
  toast.success("Account created!");

  navigate("/home");
};

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen">
        <StatusBar />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 px-6 pt-6 pb-8"
        >
          <h1 className="text-3xl font-bold text-center">Sign Up</h1>
          <p className="text-center text-muted-foreground mt-2">Create your account</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5" />
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password" type="password" className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5" />

            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} />
              <span>
                I agree to the <span className="text-primary">Terms & Conditions</span>
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full h-14 gradient-primary border-0 hover:opacity-90 rounded-2xl">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </PhoneShell>
  );
}