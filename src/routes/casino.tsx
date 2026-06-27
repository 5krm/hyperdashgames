import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Coins, Dice5, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useHyperdash } from "@/lib/hyperdash-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/casino")({
  head: () => ({
    meta: [
      { title: "Casino — HyperDash" },
      { name: "description", content: "Wager your HyperDash coins on the neon slot machine." },
    ],
  }),
  component: Casino,
});

const SYMBOLS = ["💎", "🍒", "⚡", "🔔", "7️⃣", "🪙"];

function spin(): string[] {
  return Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
}

function payout(reels: string[], wager: number): number {
  const [a, b, c] = reels;
  if (a === b && b === c) {
    if (a === "7️⃣") return wager * 25;
    if (a === "💎") return wager * 15;
    return wager * 10;
  }
  if (a === b || b === c || a === c) return wager * 2;
  return 0;
}

function Casino() {
  const { coins, addCoins, spendCoins, unlockTrophy } = useHyperdash();
  const [wager, setWager] = useState(25);
  const [reels, setReels] = useState<string[]>(["❓", "❓", "❓"]);
  const [spinning, setSpinning] = useState(false);
  const [totalWagered, setTotalWagered] = useState(0);
  const [lastWin, setLastWin] = useState(0);

  function handleSpin() {
    if (coins < wager) {
      toast.error("Not enough coins");
      return;
    }
    if (!spendCoins(wager)) return;
    setSpinning(true);
    setLastWin(0);
    const newTotal = totalWagered + wager;
    setTotalWagered(newTotal);
    if (newTotal >= 500) unlockTrophy("high-roller");

    let ticks = 0;
    const interval = window.setInterval(() => {
      setReels(spin());
      ticks++;
      if (ticks >= 12) {
        window.clearInterval(interval);
        const final = spin();
        setReels(final);
        const win = payout(final, wager);
        if (win > 0) {
          addCoins(win);
          setLastWin(win);
          toast.success(`Jackpot! +${win} coins`, { icon: "🎉" });
        } else {
          toast(`No match — try again`);
        }
        setSpinning(false);
      }
    }, 80);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
          <Dice5 className="h-3 w-3 text-[var(--neon-cyan)]" />
          Casino
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Neon <span className="text-gradient-primary">Slots</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Match three for the jackpot. Two of a kind pays 2x.</p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-gradient-card p-6 shadow-elevated sm:p-10">
        <div className="relative rounded-2xl border border-primary/40 bg-background/60 p-6">
          <div className="absolute inset-0 -z-0 bg-gradient-hero opacity-50" />
          <div className="relative grid grid-cols-3 gap-3 sm:gap-6">
            {reels.map((s, i) => (
              <div
                key={i}
                className={`grid aspect-square place-items-center rounded-2xl border border-border/60 bg-surface-elevated/80 text-5xl sm:text-7xl ${
                  spinning ? "animate-pulse" : ""
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          {lastWin > 0 && !spinning && (
            <div className="mt-4 text-center font-display text-lg text-[var(--neon-gold)]">
              <Sparkles className="mr-1 inline h-4 w-4" />
              +{lastWin} coins
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-surface-elevated/60 px-4 py-2">
            <Coins className="h-4 w-4 text-[var(--neon-gold)]" />
            <span className="font-display font-bold tabular-nums">{coins.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            {[10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => setWager(amt)}
                disabled={spinning}
                className={`h-9 rounded-full px-3 text-xs font-semibold tabular-nums transition-all ${
                  wager === amt
                    ? "bg-gradient-primary text-primary-foreground shadow-neon"
                    : "border border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {amt}
              </button>
            ))}
          </div>

          <Button
            size="lg"
            disabled={spinning || coins < wager}
            onClick={handleSpin}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-neon"
          >
            {spinning ? "Spinning…" : `Spin · ${wager}`}
          </Button>
        </div>
      </div>
    </div>
  );
}