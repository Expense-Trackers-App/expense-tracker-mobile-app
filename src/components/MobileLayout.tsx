import type { ReactNode } from "react";
import { PhoneShell } from "./PhoneShell";
import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";

interface Props {
  children: ReactNode;
  hideNav?: boolean;
  hideStatus?: boolean;
}

export function MobileLayout({ children, hideNav, hideStatus }: Props) {
  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen">
        {!hideStatus && <StatusBar />}
        <div className="flex-1 flex flex-col pb-2">{children}</div>
        {!hideNav && <BottomNav />}
      </div>
    </PhoneShell>
  );
}