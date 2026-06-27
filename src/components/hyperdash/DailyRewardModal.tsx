import { Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHyperdash } from "@/lib/hyperdash-store";

export function DailyRewardModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { claimDaily, lastDailyClaim } = useHyperdash();
  const today = new Date().toISOString().slice(0, 10);
  const alreadyClaimed = lastDailyClaim === today;

  function handleClaim() {
    const res = claimDaily();
    if (res.ok) {
      toast.success("+100 coins added to your balance", { icon: "🪙" });
      onOpenChange(false);
    } else {
      toast("Come back tomorrow for another drop.", { description: res.reason });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-border/60 bg-gradient-card sm:max-w-md">
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-70" />
        <div className="relative">
          <DialogHeader className="items-center text-center">
            <div className="mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-neon animate-pulse-glow">
              <Gift className="h-8 w-8 text-primary-foreground" />
            </div>
            <DialogTitle className="font-display text-2xl">Daily Drop Unlocked</DialogTitle>
            <DialogDescription>
              Your daily reward is waiting. Claim it and keep your streak alive.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 grid place-items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface-elevated/70 px-6 py-4">
              <Sparkles className="h-5 w-5 text-[var(--neon-gold)]" />
              <span className="font-display text-3xl font-bold text-gradient-primary">
                +100 Coins
              </span>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              size="lg"
              onClick={handleClaim}
              disabled={alreadyClaimed}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-neon"
            >
              {alreadyClaimed ? "Claimed today" : "Claim reward"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}