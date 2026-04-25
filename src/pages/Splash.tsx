import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { PhoneShell } from "@/components/PhoneShell";
import { StatusBar } from "@/components/StatusBar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export default function Splash() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen">
        <StatusBar />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-24 w-24 rounded-3xl gradient-primary glow-primary grid place-items-center mb-8"
          >
            <Wallet className="h-12 w-12 text-primary-foreground" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold"
          >
            Expense
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-clip-text text-transparent gradient-primary"
          >
            Tracker
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-muted-foreground max-w-[260px] text-sm leading-relaxed"
          >
            Track your expenses, manage your budget and save more.
          </motion.p>
        </div>
        <div className="px-6 pb-10">
          <Button
            size="lg"
            className="w-full h-14 text-base gradient-primary border-0 hover:opacity-90"
            onClick={() => navigate(user ? "/home" : "/signup")}
          >
            Get Started
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-primary font-medium">
              Login
            </button>
          </p>
        </div>
      </div>
    </PhoneShell>
  );
}