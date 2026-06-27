import { Link, useRouterState } from "@tanstack/react-router";
import { Coins, Gift, ShoppingBag, Sparkles, Trophy, Settings, Dice5, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHyperdash } from "@/lib/hyperdash-store";
import avatarImg from "@/assets/avatar.jpg";

import { DailyRewardModal } from "./DailyRewardModal";
import { SettingsModal } from "./SettingsModal";

const NAV = [
  { to: "/casino", label: "Casino", icon: Dice5 },
  { to: "/achievements", label: "Trophies", icon: Trophy },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
] as const;

export function Header() {
  const { coins, level, xp } = useHyperdash();
  const [dailyOpen, setDailyOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const xpToNext = 500;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-neon">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            HYPER<span className="text-gradient-primary">DASH</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/15 text-foreground shadow-neon"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => setDailyOpen(true)}
            className="ml-1 flex h-9 items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-foreground transition-all hover:bg-primary/20 hover:shadow-neon"
          >
            <Gift className="h-4 w-4 text-primary" />
            Surprise Me
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden h-9 items-center gap-2 rounded-full border border-border/70 bg-surface-elevated/60 px-3 sm:flex">
            <Coins className="h-4 w-4 text-[var(--neon-gold)]" />
            <span className="font-display text-sm font-semibold tabular-nums">
              {coins.toLocaleString()}
            </span>
          </div>

          <Badge className="hidden bg-gradient-primary font-display text-xs text-primary-foreground sm:inline-flex">
            LVL {level}
          </Badge>

          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-surface-elevated/60 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </button>

          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-primary opacity-70 blur-sm" />
            <img
              src={avatarImg}
              alt="Player avatar"
              width={36}
              height={36}
              className="relative h-9 w-9 rounded-full object-cover ring-2 ring-background"
            />
            <span
              className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-background text-[9px] font-bold text-foreground ring-2 ring-primary"
              aria-hidden
            >
              {level}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {NAV.map(({ to, label, icon: Icon }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link to={to} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setDailyOpen(true)}>
                <Gift className="h-4 w-4" />
                Surprise Me
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-0.5 w-full overflow-hidden bg-secondary/40">
        <div
          className="h-full bg-gradient-primary transition-all"
          style={{ width: `${Math.min(100, (xp / xpToNext) * 100)}%` }}
        />
      </div>

      <DailyRewardModal open={dailyOpen} onOpenChange={setDailyOpen} />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}