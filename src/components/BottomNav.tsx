import { Home, BarChart3, Wallet, Menu, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/expenses", label: "Expenses", icon: Wallet },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/settings", label: "More", icon: Menu },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 mt-auto">
      <div className="relative bg-card/95 backdrop-blur border-t border-border/60 px-3 pt-2 pb-3">
        <div className="grid grid-cols-5 items-center">
          {items.slice(0, 2).map((it) => (
            <NavBtn key={it.path} {...it} active={pathname === it.path} onClick={() => navigate(it.path)} />
          ))}
          <div className="flex justify-center -mt-8">
            <button
              onClick={() => navigate("/expense/new")}
              aria-label="Add expense"
              className="h-14 w-14 rounded-full gradient-primary glow-primary grid place-items-center text-primary-foreground hover:scale-105 active:scale-95 transition"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
          {items.slice(2).map((it) => (
            <NavBtn key={it.path} {...it} active={pathname === it.path} onClick={() => navigate(it.path)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Home;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-1 text-[11px] transition ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}