import { create } from "zustand";

export type MapType = "space" | "forest";
export type WeaponType = "pistol" | "shotgun" | "rifle";
export type GamePhase = "menu" | "playing" | "gameover";

export interface WeaponConfig {
  name: string;
  damage: number;
  fireRate: number;
  maxAmmo: number;
}

export const WEAPONS: Record<WeaponType, WeaponConfig> = {
  pistol: { name: "PISTOL", damage: 25, fireRate: 500, maxAmmo: 12 },
  shotgun: { name: "SHOTGUN", damage: 60, fireRate: 1200, maxAmmo: 6 },
  rifle: { name: "ASSAULT RIFLE", damage: 15, fireRate: 100, maxAmmo: 30 },
};

export interface EnemyData {
  id: string;
  health: number;
  maxHealth: number;
  spawnX: number;
  spawnZ: number;
}

export interface ScoreEntry {
  name: string;
  score: number;
  wave: number;
  date: number;
}

function generateSpawnPositions(count: number): { x: number; z: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.8;
    const dist = 15 + Math.random() * 10;
    return { x: Math.cos(angle) * dist, z: Math.sin(angle) * dist };
  });
}

function saveScore(name: string, score: number, wave: number) {
  const scores: ScoreEntry[] = JSON.parse(
    localStorage.getItem("pvp-shooter-scores") || "[]",
  );
  scores.push({ name, score, wave, date: Date.now() });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(
    "pvp-shooter-scores",
    JSON.stringify(scores.slice(0, 10)),
  );
}

export function getTopScores(): ScoreEntry[] {
  return JSON.parse(localStorage.getItem("pvp-shooter-scores") || "[]");
}

interface GameStore {
  gamePhase: GamePhase;
  mapType: MapType;
  playerName: string;
  playerHealth: number;
  currentWeapon: WeaponType;
  ammo: number;
  score: number;
  wave: number;
  enemies: EnemyData[];
  waveClearing: boolean;

  setMapType: (map: MapType) => void;
  setPlayerName: (name: string) => void;
  startGame: () => void;
  returnToMenu: () => void;
  takeDamage: (amount: number) => void;
  setCurrentWeapon: (weapon: WeaponType) => void;
  decrementAmmo: () => boolean;
  damageEnemy: (id: string, damage: number) => void;
  spawnWave: (wave: number) => void;
  completeWave: () => void;
  setWaveClearing: (v: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gamePhase: "menu",
  mapType: "space",
  playerName: "OPERATIVE",
  playerHealth: 100,
  currentWeapon: "pistol",
  ammo: WEAPONS.pistol.maxAmmo,
  score: 0,
  wave: 0,
  enemies: [],
  waveClearing: false,

  setMapType: (map) => set({ mapType: map }),
  setPlayerName: (name) => set({ playerName: name }),

  startGame: () => {
    const wave = 1;
    const count = 3;
    const positions = generateSpawnPositions(count);
    const enemies: EnemyData[] = positions.map((p, i) => ({
      id: `e-${Date.now()}-${i}`,
      health: 50,
      maxHealth: 50,
      spawnX: p.x,
      spawnZ: p.z,
    }));
    set({
      gamePhase: "playing",
      playerHealth: 100,
      currentWeapon: "pistol",
      ammo: WEAPONS.pistol.maxAmmo,
      score: 0,
      wave,
      enemies,
      waveClearing: false,
    });
  },

  returnToMenu: () => set({ gamePhase: "menu" }),

  takeDamage: (amount) =>
    set((state) => {
      const health = Math.max(0, state.playerHealth - amount);
      if (health <= 0) {
        saveScore(state.playerName, state.score, state.wave);
        return { playerHealth: 0, gamePhase: "gameover" };
      }
      return { playerHealth: health };
    }),

  setCurrentWeapon: (weapon) =>
    set({ currentWeapon: weapon, ammo: WEAPONS[weapon].maxAmmo }),

  decrementAmmo: () => {
    const state = get();
    if (state.ammo <= 0) return false;
    set({ ammo: state.ammo - 1 });
    return true;
  },

  damageEnemy: (id, damage) =>
    set((state) => {
      let scoreGain = 0;
      const newEnemies = state.enemies
        .map((e) => (e.id === id ? { ...e, health: e.health - damage } : e))
        .filter((e) => {
          if (e.health <= 0) {
            scoreGain += 10;
            return false;
          }
          return true;
        });
      return { enemies: newEnemies, score: state.score + scoreGain };
    }),

  spawnWave: (wave) => {
    const count = 3 + (wave - 1) * 2;
    const enemyHealth = 50 + (wave - 1) * 20;
    const positions = generateSpawnPositions(count);
    const enemies: EnemyData[] = positions.map((p, i) => ({
      id: `e-${Date.now()}-${wave}-${i}`,
      health: enemyHealth,
      maxHealth: enemyHealth,
      spawnX: p.x,
      spawnZ: p.z,
    }));
    set({ enemies, wave, waveClearing: false });
  },

  completeWave: () =>
    set((state) => ({ score: state.score + 50, waveClearing: true })),

  setWaveClearing: (v) => set({ waveClearing: v }),
}));
