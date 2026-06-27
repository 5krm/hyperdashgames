import { Link } from "@tanstack/react-router";
import { Heart, Play, Star, Users } from "lucide-react";

import { useHyperdash } from "@/lib/hyperdash-store";
import type { Game } from "@/lib/games-data";

export function GameCard({ game }: { game: Game }) {
  const { isFavorite, toggleFavorite } = useHyperdash();
  const fav = isFavorite(game.id);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-neon">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          width={768}
          height={512}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

        {game.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-neon">
            Featured
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(game.id);
          }}
          aria-label={fav ? "Remove favorite" : "Add to favorites"}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all ${
            fav
              ? "bg-primary text-primary-foreground shadow-neon"
              : "bg-background/60 text-foreground hover:bg-primary/80 hover:text-primary-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            to="/game/$id"
            params={{ id: game.id }}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary font-display text-sm font-semibold text-primary-foreground shadow-neon"
          >
            <Play className="h-4 w-4 fill-current" />
            Play Now
          </Link>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-display text-base font-semibold">{game.title}</h3>
          <span className="shrink-0 rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {game.genre}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[var(--neon-gold)] text-[var(--neon-gold)]" />
            {game.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {Intl.NumberFormat("en", { notation: "compact" }).format(game.plays)}
          </span>
        </div>
      </div>
    </article>
  );
}