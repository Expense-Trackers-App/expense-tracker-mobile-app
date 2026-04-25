import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight, HelpCircle, Info, Link2, LogOut, Lock, User } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, logout } = useApp();

  return (
    <MobileLayout>
      <AppHeader title="Settings" showBack={false} />
      <div className="px-5 pb-6 space-y-6">
        <Section title="General">
          <Row label="Currency">
            <Select value={settings.currency} onValueChange={(v) => updateSettings({ currency: v })}>
              <SelectTrigger className="h-9 w-32 bg-transparent border-0 p-0 justify-end gap-1 text-muted-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["USD", "EUR", "GBP", "JPY", "INR"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
          <Row label="Language">
            <span className="text-sm text-muted-foreground">{settings.language}</span>
          </Row>
          <Row label="Dark Mode">
            <Switch checked={settings.darkMode} onCheckedChange={(v) => updateSettings({ darkMode: v })} />
          </Row>
        </Section>

        <Section title="Account">
          <NavRow icon={User} label="Profile" onClick={() => navigate("/settings/profile")} />
          <NavRow icon={Lock} label="Security" onClick={() => navigate("/settings/security")} />
          <NavRow icon={Link2} label="Linked Accounts" onClick={() => toast.info("Linked accounts feature coming soon!")} />
        </Section>

        <Section title="Others">
          <Row label={<span className="flex items-center gap-3"><Bell className="h-4 w-4" /> Notifications</span>}>
            <Switch checked={settings.notifications} onCheckedChange={(v) => updateSettings({ notifications: v })} />
          </Row>
          <NavRow icon={HelpCircle} label="Help & Support" onClick={() => navigate("/settings/help")} />
          <NavRow icon={Info} label="About App" onClick={() => toast.info("PocketWise Pro v1.0.0")} />
        </Section>

        <button
          onClick={() => {
            logout();
            navigate("/");
            toast.success("Logged out");
          }}
          className="w-full flex items-center justify-center gap-2 h-12 text-destructive font-semibold"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </MobileLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-1">{title}</p>
      <div className="bg-card rounded-2xl divide-y divide-border/40">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

function NavRow({ icon: Icon, label, onClick }: { icon: typeof User; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/40 transition">
      <span className="flex items-center gap-3 text-sm"><Icon className="h-4 w-4" /> {label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}