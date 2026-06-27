import game1 from "@/assets/game-1.jpg";
import game2 from "@/assets/game-2.jpg";
import game3 from "@/assets/game-3.jpg";
import game4 from "@/assets/game-4.jpg";
import game5 from "@/assets/game-5.jpg";
import game6 from "@/assets/game-6.jpg";
import game7 from "@/assets/game-7.jpg";
import game8 from "@/assets/game-8.jpg";
import game9 from "@/assets/game-9.jpg";
import game10 from "@/assets/game-10.jpg";
import game11 from "@/assets/game-11.jpg";
import game12 from "@/assets/game-12.jpg";

export type GameGenre = "Action" | "Puzzle" | "Racing" | "Arcade" | "Sports" | "Strategy";

export type Game = {
  id: string;
  title: string;
  genre: GameGenre;
  thumbnail: string;
  description: string;
  plays: number;
  rating: number;
  embedUrl: string;
  featured?: boolean;
};

export const GAMES: Game[] = [
  { id: "stellar-strike", title: "Stellar Strike", genre: "Action", thumbnail: game1, description: "Pilot a hyper-fighter through neon nebulae and obliterate rogue fleets in this twin-stick space shooter.", plays: 18420, rating: 4.8, embedUrl: "https://html5.gamedistribution.com/rvvASMiM/4f7b86c40b264e36b1ec98e716bd2f5b/index.html", featured: true },
  { id: "lumen-blocks", title: "Lumen Blocks", genre: "Puzzle", thumbnail: game2, description: "Stack glowing tetrominoes against the clock in a puzzle reimagined for the neon era.", plays: 12990, rating: 4.6, embedUrl: "about:blank" },
  { id: "chrome-rush", title: "Chrome Rush", genre: "Racing", thumbnail: game3, description: "Drift through a midnight metropolis at supersonic speed.", plays: 22310, rating: 4.9, embedUrl: "about:blank", featured: true },
  { id: "neon-ninja", title: "Neon Ninja", genre: "Action", thumbnail: game4, description: "Wall-jump, dash and slice through a glowing dojo platformer.", plays: 9870, rating: 4.7, embedUrl: "about:blank" },
  { id: "void-gunner", title: "Void Gunner", genre: "Action", thumbnail: game5, description: "First-person bullet hell across an electric corridor.", plays: 15420, rating: 4.5, embedUrl: "about:blank" },
  { id: "glow-serpent", title: "Glow Serpent", genre: "Arcade", thumbnail: game6, description: "The classic snake — supercharged with combo multipliers.", plays: 31200, rating: 4.4, embedUrl: "about:blank" },
  { id: "holo-poker", title: "Holo Poker", genre: "Strategy", thumbnail: game7, description: "Bluff your way to victory at the holographic high-roller table.", plays: 7820, rating: 4.6, embedUrl: "about:blank" },
  { id: "plasma-pinball", title: "Plasma Pinball", genre: "Arcade", thumbnail: game8, description: "An electric pinball table with chain bonuses and a multiball mode.", plays: 11340, rating: 4.5, embedUrl: "about:blank" },
  { id: "tower-pulse", title: "Tower Pulse", genre: "Strategy", thumbnail: game9, description: "Defend the grid with modular neon turrets across endless waves.", plays: 13800, rating: 4.7, embedUrl: "about:blank" },
  { id: "fist-of-neon", title: "Fist of Neon", genre: "Action", thumbnail: game10, description: "Outline-style 1v1 combat with rollback-style timing.", plays: 9420, rating: 4.3, embedUrl: "about:blank" },
  { id: "beat-cascade", title: "Beat Cascade", genre: "Arcade", thumbnail: game11, description: "Hit every glowing note to climb the global rhythm ladder.", plays: 17650, rating: 4.8, embedUrl: "about:blank" },
  { id: "stadium-zero", title: "Stadium Zero", genre: "Sports", thumbnail: game12, description: "Anti-grav soccer with hover boots and a smart ball.", plays: 14110, rating: 4.6, embedUrl: "about:blank" },
];

export const GENRES: ("All" | "Favorites" | GameGenre)[] = [
  "All",
  "Favorites",
  "Action",
  "Puzzle",
  "Racing",
  "Arcade",
  "Sports",
  "Strategy",
];

export function getGameById(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}

export const TOTAL_GAMES_LABEL = "100+";