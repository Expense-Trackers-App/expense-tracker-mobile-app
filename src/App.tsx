import { useEffect } from "react"; // ✅ ADD THIS
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"; // ✅ ADD useNavigate
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Budgets from "./pages/Budgets";
import BudgetDetails from "./pages/BudgetDetails";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import Help from "./pages/Help";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabase } from "@/lib/supabaseClient"; // ✅ ADD THIS

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);

        if (event === "SIGNED_IN") {
          console.log("User logged in:", session?.user?.email);
        }

        if (event === "SIGNED_OUT") {
          console.log("User logged out");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/welcome" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/expense/new" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
              <Route path="/expense/:id" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
              <Route path="/budget/:id" element={<ProtectedRoute><BudgetDetails /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/settings/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
              <Route path="/settings/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;