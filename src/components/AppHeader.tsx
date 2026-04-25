import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  showBack?: boolean;
}

export function AppHeader({ title, onBack, right, showBack = true }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 py-4">
      {showBack ? (
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="h-10 w-10 grid place-items-center rounded-full bg-secondary/60 hover:bg-secondary transition"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <span className="w-10" />
      )}
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  );
}