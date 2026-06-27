import { createFileRoute } from "@tanstack/react-router";
import { Lock, Trophy } from "lucide-react";

import { useHyperdash } from "@/lib/hyperdash-store";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Trophies — HyperDash" },
      { name: "description", content: "Track your unlocked trophies and chase the next milestone on HyperDash." },
    ],
  }),
  component: Achievements,
});

function Achievements() {
  const { trophies } = useHyperdash();
  const unlocked = trophies.filter((t) => t.unlocked).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <Trophy className="h-3 w-3 text-[var(--neon-gold)]" />
            Trophies
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Your trophy case</h1>
          <p className="mt-1 text-muted-foreground">
            {unlocked} of {trophies.length} unlocked. Keep playing to earn the rest.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
            <div
              className="h-full bg-gradient-primary"
              style={{ width: `${(unlocked / trophies.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trophies.map((t) => (
          <div
            key={t.id}
            className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
              t.unlocked
                ? "border-primary/40 bg-gradient-card shadow-neon"
                : "border-border/60 bg-surface/40 opacity-70"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl ${
                  t.unlocked
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-secondary/60 text-muted-foreground"
                }`}
              >
                {t.unlocked ? t.icon : <Lock className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
                {t.unlocked && (
                  <span className="mt-2 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    Unlocked
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}