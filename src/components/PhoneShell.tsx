import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-[hsl(230_25%_6%)] to-background flex justify-center">
      <div className="phone-frame border-x border-border/40">{children}</div>
    </div>
  );
}