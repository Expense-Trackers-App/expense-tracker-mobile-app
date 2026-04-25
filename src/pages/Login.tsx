import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneShell } from "@/components/PhoneShell";
import { StatusBar } from "@/components/StatusBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  login(email);
  toast.success("Welcome back!");
  navigate("/home");
};

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first to reset password");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent!");
    }
  };

  const social = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) toast.error(error.message);
  };

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen">
        <StatusBar />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 px-6 pt-6"
        >
          <h1 className="text-3xl font-bold text-center">Login 👋</h1>
          <p className="text-center text-muted-foreground mt-2">Welcome back!</p>

          <form onSubmit={submit} className="mt-10 space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5"
            />
            <div className="text-right">
              <button type="button" onClick={handleResetPassword} className="text-sm text-primary">
                Forgot password?
              </button>
            </div>
            <Button type="submit" size="lg" className="w-full h-14 gradient-primary border-0 hover:opacity-90 rounded-2xl">
              Login
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => social("google")} className="h-14 rounded-2xl bg-secondary/60 border border-border/50 flex items-center justify-center gap-2 hover:bg-secondary transition">
              <span className="font-medium">G  Google</span>
            </button>
            <button onClick={() => social("apple")} className="h-14 rounded-2xl bg-secondary/60 border border-border/50 flex items-center justify-center gap-2 hover:bg-secondary transition">
              <span className="font-medium"> Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </PhoneShell>
  );
}