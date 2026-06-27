import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Gamepad2, Flame, Sparkles, TrendingUp } from "lucide-react";

import { GAMES, GENRES, TOTAL_GAMES_LABEL } from "@/lib/games-data";
import { GameCard } from "@/components/hyperdash/GameCard";
import { useHyperdash } from "@/lib/hyperdash-store";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HyperDash — Premium Web Game Hub" },
      { name: "description", content: "Play 100+ instant arcade games. Earn coins, unlock trophies, and customize your loadout on HyperDash." },
      { property: "og:title", content: "HyperDash — Premium Web Game Hub" },
      { property: "og:description", content: "Play 100+ instant arcade games. Earn coins, unlock trophies, and customize your loadout on HyperDash." },
    ],
  }),
  component: Index,
});

function Index() {
  const { favorites } = useHyperdash();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof GENRES)[number]>("All");

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      if (category === "Favorites" && !favorites.includes(g.id)) return false;
      if (category !== "All" && category !== "Favorites" && g.genre !== category) return false;
      if (query && !g.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, category, favorites]);

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/50 via-background/70 to-background" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground">
              <Sparkles className="h-3 w-3 text-[var(--neon-cyan)]" />
              {TOTAL_GAMES_LABEL} Arcade Games · Instant Play
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Press start.
              <br />
              <span className="text-gradient-primary">Enter HyperDash.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              A premium hub for the best HTML5 arcade games. Earn coins as you
              play, unlock trophies, customize your loadout, and chase the
              leaderboard — all in your browser.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Stat icon={<Gamepad2 className="h-4 w-4" />} label="Games" value="100+" />
              <Stat icon={<Flame className="h-4 w-4" />} label="Played today" value="12.4k" />
              <Stat icon={<TrendingUp className="h-4 w-4" />} label="Live now" value="384" />
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl border border-border/60 p-3 shadow-elevated sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 100+ games…"
                className="h-11 w-full rounded-xl border border-border/60 bg-surface-elevated/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {GENRES.map((g) => {
              const active = category === g;
              return (
                <button
                  key={g}
                  onClick={() => setCategory(g)}
                  className={`h-8 rounded-full px-3.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-neon"
                      : "border border-border/60 bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {category === "All" ? "All games" : category === "Favorites" ? "Your favorites" : `${category} games`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "game" : "games"} ready to launch
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 bg-surface/30 py-16 text-center">
            <Gamepad2 className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-display text-lg">No games match your search.</p>
            <p className="text-sm text-muted-foreground">Try a different category or clear filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-surface-elevated/60 px-3 py-1.5 text-xs">
      <span className="text-[var(--neon-cyan)]">{icon}</span>
      <span className="font-display font-semibold tabular-nums">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
