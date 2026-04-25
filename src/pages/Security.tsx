import { MobileLayout } from "@/components/MobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function Security() {
  const { user } = useApp();

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent to " + user.email);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Security" showBack={true} />
      <div className="px-5 pb-6 space-y-6 pt-4">
        <div className="flex flex-col items-center gap-4 pb-4">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary">
            <Shield size={32} />
          </div>
          <h2 className="text-xl font-bold">Account Security</h2>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border/40">
          <h3 className="font-semibold mb-2">Change Password</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We will send a password reset link to your registered email address.
          </p>
          <Button onClick={handlePasswordReset} variant="outline" className="w-full h-12 rounded-xl">
            Send Reset Link
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border/40">
          <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data.
          </p>
          <Button variant="destructive" className="w-full h-12 rounded-xl" onClick={() => toast.error("Feature not enabled in demo")}>
            Delete Account
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
