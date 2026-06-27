import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Heart, Play, Star, Users } from "lucide-react";

import { getGameById, GAMES } from "@/lib/games-data";
import { useHyperdash } from "@/lib/hyperdash-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/game/$id")({
  component: GamePlayer,
  loader: ({ params }) => {
    const game = getGameById(params.id);
    if (!game) throw notFound();
    return { game };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Game not found</h1>
      <p className="mt-2 text-muted-foreground">That cartridge is missing from our library.</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Back to Hub
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Couldn't load this game</h1>
        <Button
          className="mt-4"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
      </div>
    );
  },
  head: ({ params }) => {
    const g = GAMES.find((x) => x.id === params.id);
    return {
      meta: [
        { title: g ? `Play ${g.title} — HyperDash` : "HyperDash" },
        { name: "description", content: g?.description ?? "Play instantly on HyperDash." },
        { property: "og:title", content: g ? `Play ${g.title} — HyperDash` : "HyperDash" },
        { property: "og:description", content: g?.description ?? "Play instantly on HyperDash." },
        ...(g?.thumbnail ? [{ property: "og:image", content: g.thumbnail }] : []),
      ],
    };
  },
});

function GamePlayer() {
  const { game } = Route.useLoaderData();
  const { isFavorite, toggleFavorite } = useHyperdash();
  const fav = isFavorite(game.id);

  const related = GAMES.filter((g) => g.id !== game.id && g.genre === game.genre).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hub
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black shadow-elevated">
            <iframe
              src={game.embedUrl}
              title={game.title}
              allow="autoplay; fullscreen; gamepad"
              className="w-full aspect-video"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {game.genre}
              </span>
              <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{game.title}</h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[var(--neon-gold)] text-[var(--neon-gold)]" />
                  {game.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {game.plays.toLocaleString()} plays
                </span>
              </div>
            </div>
            <Button
              onClick={() => toggleFavorite(game.id)}
              className={fav ? "bg-gradient-primary text-primary-foreground hover:opacity-90" : ""}
              variant={fav ? "default" : "outline"}
            >
              <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
              {fav ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>

          <p className="mt-4 max-w-3xl text-muted-foreground">{game.description}</p>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-gradient-card p-5">
            <h3 className="font-display text-lg font-semibold">More {game.genre}</h3>
            <ul className="mt-3 space-y-3">
              {related.length === 0 && <li className="text-sm text-muted-foreground">No related games yet.</li>}
              {related.map((g) => (
                <li key={g.id}>
                  <Link
                    to="/game/$id"
                    params={{ id: g.id }}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-elevated/40 p-2 transition-colors hover:border-primary/60"
                  >
                    <img src={g.thumbnail} alt={g.title} loading="lazy" width={64} height={48} className="h-12 w-16 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{g.title}</p>
                      <p className="text-xs text-muted-foreground">{g.genre}</p>
                    </div>
                    <Play className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}