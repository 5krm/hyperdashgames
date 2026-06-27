import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "hyperdash:v1";

export type Trophy = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type ShopItem = {
  id: string;
  name: string;
  kind: "theme" | "avatar" | "boost";
  cost: number;
  description: string;
  swatch: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: "theme-midnight", name: "Midnight Bloom", kind: "theme", cost: 500, description: "Deep violet UI accent pack.", swatch: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { id: "theme-cyber", name: "Cyber Drift", kind: "theme", cost: 750, description: "Holographic cyan and magenta theme.", swatch: "linear-gradient(135deg, #06b6d4, #f472b6)" },
  { id: "theme-sunset", name: "Sunset Arcade", kind: "theme", cost: 600, description: "Warm orange and pink sundown palette.", swatch: "linear-gradient(135deg, #f97316, #ef4444)" },
  { id: "avatar-pixel", name: "Pixel Phantom", kind: "avatar", cost: 300, description: "Animated 8-bit profile portrait.", swatch: "linear-gradient(135deg, #22d3ee, #a78bfa)" },
  { id: "avatar-cyborg", name: "Cyborg Operator", kind: "avatar", cost: 450, description: "Premium chrome avatar set.", swatch: "linear-gradient(135deg, #f43f5e, #f59e0b)" },
  { id: "avatar-mascot", name: "HyperDash Mascot", kind: "avatar", cost: 900, description: "Exclusive platform mascot.", swatch: "linear-gradient(135deg, #10b981, #06b6d4)" },
  { id: "boost-double", name: "2x Coin Boost (1h)", kind: "boost", cost: 250, description: "Double coin rewards for an hour.", swatch: "linear-gradient(135deg, #fbbf24, #f97316)" },
  { id: "boost-streak", name: "Streak Shield", kind: "boost", cost: 350, description: "Protect your daily login streak.", swatch: "linear-gradient(135deg, #60a5fa, #8b5cf6)" },
];

const INITIAL_TROPHIES: Trophy[] = [
  { id: "first-blood", title: "First Blood", description: "Play your first game on HyperDash.", icon: "🩸", unlocked: false },
  { id: "coin-collector", title: "Coin Collector", description: "Reach a balance of 1,000 coins.", icon: "🪙", unlocked: false },
  { id: "daily-grinder", title: "Daily Grinder", description: "Claim 7 daily rewards in a row.", icon: "🔥", unlocked: false },
  { id: "favorite-fan", title: "Favorite Fan", description: "Favorite 5 different games.", icon: "❤️", unlocked: false },
  { id: "high-roller", title: "High Roller", description: "Wager 500 coins in the Casino.", icon: "🎰", unlocked: false },
  { id: "shopper", title: "Style Maven", description: "Purchase your first shop item.", icon: "🛒", unlocked: false },
  { id: "level-up", title: "Level Up", description: "Reach player level 5.", icon: "⚡", unlocked: false },
  { id: "completionist", title: "Completionist", description: "Try every genre on the hub.", icon: "🏆", unlocked: false },
];

type Prefs = { soundOn: boolean; reducedMotion: boolean; particleFx: boolean };

type State = {
  coins: number;
  level: number;
  xp: number;
  favorites: string[];
  inventory: string[];
  trophies: Trophy[];
  prefs: Prefs;
  lastDailyClaim: string | null;
  cookiesAccepted: boolean;
};

const DEFAULT_STATE: State = {
  coins: 850,
  level: 3,
  xp: 240,
  favorites: [],
  inventory: [],
  trophies: INITIAL_TROPHIES,
  prefs: { soundOn: true, reducedMotion: false, particleFx: true },
  lastDailyClaim: null,
  cookiesAccepted: false,
};

type Ctx = State & {
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  buyItem: (item: ShopItem) => { ok: boolean; reason?: string };
  unlockTrophy: (id: string) => void;
  setPref: <K extends keyof Prefs>(key: K, val: Prefs[K]) => void;
  claimDaily: () => { ok: boolean; reason?: string };
  acceptCookies: () => void;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

function loadState(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      trophies: INITIAL_TROPHIES.map(
        (t) => parsed.trophies?.find((x) => x.id === t.id) ?? t,
      ),
      prefs: { ...DEFAULT_STATE.prefs, ...(parsed.prefs ?? {}) },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function HyperdashProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — ignore */
    }
  }, [state, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      addCoins: (n) => setState((s) => ({ ...s, coins: s.coins + n })),
      spendCoins: (n) => {
        let ok = false;
        setState((s) => {
          if (s.coins < n) return s;
          ok = true;
          return { ...s, coins: s.coins - n };
        });
        return ok;
      },
      toggleFavorite: (id) =>
        setState((s) => {
          const has = s.favorites.includes(id);
          const favorites = has ? s.favorites.filter((x) => x !== id) : [...s.favorites, id];
          const trophies = s.trophies.map((t) =>
            t.id === "favorite-fan" && favorites.length >= 5 ? { ...t, unlocked: true } : t,
          );
          return { ...s, favorites, trophies };
        }),
      isFavorite: (id) => state.favorites.includes(id),
      buyItem: (item) => {
        if (state.inventory.includes(item.id)) return { ok: false, reason: "Already owned" };
        if (state.coins < item.cost) return { ok: false, reason: "Not enough coins" };
        setState((s) => ({
          ...s,
          coins: s.coins - item.cost,
          inventory: [...s.inventory, item.id],
          trophies: s.trophies.map((t) =>
            t.id === "shopper" ? { ...t, unlocked: true } : t,
          ),
        }));
        return { ok: true };
      },
      unlockTrophy: (id) =>
        setState((s) => ({
          ...s,
          trophies: s.trophies.map((t) => (t.id === id ? { ...t, unlocked: true } : t)),
        })),
      setPref: (key, val) =>
        setState((s) => ({ ...s, prefs: { ...s.prefs, [key]: val } })),
      claimDaily: () => {
        const today = new Date().toISOString().slice(0, 10);
        if (state.lastDailyClaim === today) return { ok: false, reason: "Already claimed today" };
        setState((s) => ({ ...s, coins: s.coins + 100, lastDailyClaim: today }));
        return { ok: true };
      },
      acceptCookies: () => setState((s) => ({ ...s, cookiesAccepted: true })),
      reset: () => setState(DEFAULT_STATE),
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useHyperdash(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useHyperdash must be used inside HyperdashProvider");
  return ctx;
}