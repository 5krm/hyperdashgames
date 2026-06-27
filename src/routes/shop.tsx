import { createFileRoute } from "@tanstack/react-router";
import { Coins, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { SHOP_ITEMS, useHyperdash, type ShopItem } from "@/lib/hyperdash-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Coin Shop — HyperDash" },
      { name: "description", content: "Spend your HyperDash coins on themes, avatars and boosts." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { coins, inventory, buyItem } = useHyperdash();

  function handleBuy(item: ShopItem) {
    const res = buyItem(item);
    if (res.ok) toast.success(`Unlocked: ${item.name}`, { description: `−${item.cost} coins` });
    else toast.error(res.reason ?? "Purchase failed");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <ShoppingBag className="h-3 w-3 text-[var(--neon-cyan)]" />
            Coin Shop
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Outfit your loadout</h1>
          <p className="mt-1 max-w-xl text-muted-foreground">
            Spend coins on UI themes, avatars and boosts. Everything you buy stays on your device.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-surface-elevated/60 px-4 py-2">
          <Coins className="h-4 w-4 text-[var(--neon-gold)]" />
          <span className="font-display text-lg font-bold tabular-nums">{coins.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">coins</span>
        </div>
      </div>

      {(["theme", "avatar", "boost"] as const).map((kind) => (
        <section key={kind} className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold capitalize">{kind}s</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SHOP_ITEMS.filter((i) => i.kind === kind).map((item) => {
              const owned = inventory.includes(item.id);
              const affordable = coins >= item.cost;
              return (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-card">
                  <div className="h-32 w-full" style={{ background: item.swatch }} />
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full border border-border/60 bg-surface-elevated/60 px-2 py-1 text-xs font-semibold">
                        <Coins className="h-3 w-3 text-[var(--neon-gold)]" />
                        {item.cost}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleBuy(item)}
                      disabled={owned || !affordable}
                      className={
                        owned
                          ? "w-full"
                          : "w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                      }
                      variant={owned ? "secondary" : "default"}
                    >
                      {owned ? (
                        <>
                          <Check className="h-4 w-4" />
                          Owned
                        </>
                      ) : affordable ? (
                        "Buy now"
                      ) : (
                        "Not enough coins"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}