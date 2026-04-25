import { useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { User } from "lucide-react";

export default function Profile() {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || "");

  const handleSave = () => {
    // In a real app, you'd save this to Supabase or Context
    toast.success("Profile updated successfully!");
  };

  return (
    <MobileLayout>
      <AppHeader title="Profile" showBack={true} />
      <div className="px-5 pb-6 space-y-6 pt-4">
        <div className="flex flex-col items-center gap-4 pb-4">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-primary">
            <User size={40} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input value={user?.email || ""} disabled className="h-14 bg-secondary/60 border-border/50 rounded-2xl px-5 opacity-70" />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-14 gradient-primary border-0 hover:opacity-90 rounded-2xl mt-8">
          Save Changes
        </Button>
      </div>
    </MobileLayout>
  );
}
