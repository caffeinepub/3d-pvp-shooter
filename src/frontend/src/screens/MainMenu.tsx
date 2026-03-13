import { Shield, Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { getTopScores, useGameStore } from "../store/gameStore";
import type { MapType } from "../store/gameStore";

const MAP_DATA = [
  {
    id: "space" as MapType,
    name: "VOID STATION",
    desc: "Zero-gravity asteroid field. Alien bot incursions. Survive the void.",
    color: "oklch(0.78 0.17 195)",
    accentColor: "oklch(0.6 0.15 280)",
    bgGradient:
      "radial-gradient(ellipse at 30% 50%, oklch(0.12 0.08 270 / 0.8) 0%, oklch(0.07 0.025 255) 70%)",
    threat: "ALIEN BOTS",
    env: "ASTEROID FIELD",
  },
  {
    id: "forest" as MapType,
    name: "VERDANT SIEGE",
    desc: "Dense jungle terrain. Enemy soldiers closing in. Hold the perimeter.",
    color: "oklch(0.65 0.22 145)",
    accentColor: "oklch(0.7 0.18 105)",
    bgGradient:
      "radial-gradient(ellipse at 70% 50%, oklch(0.12 0.06 145 / 0.8) 0%, oklch(0.07 0.025 255) 70%)",
    threat: "SOLDIERS",
    env: "FOREST SECTOR",
  },
];

export function MainMenu() {
  const [selectedMap, setSelectedMap] = useState<MapType>("space");
  const [playerName, setPlayerName] = useState(
    useGameStore.getState().playerName,
  );
  const { setMapType, setPlayerName: storeSetName, startGame } = useGameStore();

  const topScores = getTopScores().slice(0, 5);

  const handleStart = () => {
    storeSetName(playerName || "OPERATIVE");
    setMapType(selectedMap);
    startGame();
  };

  return (
    <div
      className="relative flex h-screen w-screen flex-col overflow-hidden"
      style={{ background: "oklch(0.07 0.025 255)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 scanline-bg" />
      <div
        className="pointer-events-none absolute inset-x-0 h-px animate-scanline opacity-20"
        style={{ background: "oklch(0.78 0.17 195)" }}
      />

      {/* Corner decorations */}
      <div
        className="absolute left-4 top-4 h-12 w-12"
        style={{
          borderLeft: "2px solid oklch(0.78 0.17 195 / 0.6)",
          borderTop: "2px solid oklch(0.78 0.17 195 / 0.6)",
        }}
      />
      <div
        className="absolute right-4 top-4 h-12 w-12"
        style={{
          borderRight: "2px solid oklch(0.78 0.17 195 / 0.6)",
          borderTop: "2px solid oklch(0.78 0.17 195 / 0.6)",
        }}
      />
      <div
        className="absolute bottom-4 left-4 h-12 w-12"
        style={{
          borderLeft: "2px solid oklch(0.78 0.17 195 / 0.6)",
          borderBottom: "2px solid oklch(0.78 0.17 195 / 0.6)",
        }}
      />
      <div
        className="absolute bottom-4 right-4 h-12 w-12"
        style={{
          borderRight: "2px solid oklch(0.78 0.17 195 / 0.6)",
          borderBottom: "2px solid oklch(0.78 0.17 195 / 0.6)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 p-8">
        {/* Title */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="font-display text-xs tracking-[0.5em]"
            style={{ color: "oklch(0.78 0.17 195 / 0.7)" }}
          >
            ◆ TACTICAL ENGAGEMENT SYSTEM ◆
          </div>
          <h1
            className="font-display text-6xl font-black tracking-widest text-glow-cyan md:text-8xl"
            style={{ color: "oklch(0.88 0.12 195)" }}
          >
            APEX
            <span
              className="text-glow-amber"
              style={{ color: "oklch(0.8 0.18 58)" }}
            >
              {" "}
              STRIKE
            </span>
          </h1>
          <div
            className="font-display text-xs tracking-[0.4em]"
            style={{ color: "oklch(0.5 0.04 225)" }}
          >
            3D TACTICAL SHOOTER · WAVE DEFENSE
          </div>
        </motion.div>

        <motion.div
          className="flex w-full max-w-5xl flex-col gap-6 lg:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Map selection */}
          <div className="flex flex-1 flex-col gap-4">
            <div
              className="font-display text-xs tracking-[0.3em]"
              style={{ color: "oklch(0.6 0.06 225)" }}
            >
              SELECT THEATER OF OPERATIONS
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MAP_DATA.map((map) => (
                <motion.button
                  key={map.id}
                  type="button"
                  onClick={() => setSelectedMap(map.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden p-4 text-left transition-all"
                  style={{
                    background:
                      selectedMap === map.id
                        ? map.bgGradient
                        : "oklch(0.11 0.03 255)",
                    border: `2px solid ${selectedMap === map.id ? map.color : "oklch(0.26 0.07 230 / 0.5)"}`,
                    clipPath:
                      "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                    boxShadow:
                      selectedMap === map.id
                        ? `0 0 30px ${map.color}40`
                        : "none",
                  }}
                  data-ocid={`menu.${map.id}.button`}
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <div
                      className="font-display text-xs tracking-widest"
                      style={{ color: map.accentColor }}
                    >
                      {map.env}
                    </div>
                    <div
                      className="font-display text-base font-black tracking-wider"
                      style={{
                        color:
                          selectedMap === map.id
                            ? map.color
                            : "oklch(0.7 0.04 220)",
                      }}
                    >
                      {map.name}
                    </div>
                    <div
                      className="mt-1 text-xs"
                      style={{ color: "oklch(0.55 0.04 220)" }}
                    >
                      {map.desc}
                    </div>
                    <div
                      className="mt-2 flex items-center gap-1"
                      style={{ color: map.accentColor, fontSize: 10 }}
                    >
                      <Target size={10} />
                      <span className="font-display tracking-wider">
                        {map.threat}
                      </span>
                    </div>
                  </div>
                  {selectedMap === map.id && (
                    <div
                      className="absolute right-2 top-2 font-display text-xs"
                      style={{ color: map.color }}
                    >
                      ◆
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Weapon info */}
            <div
              className="p-3"
              style={{
                background: "oklch(0.11 0.03 255)",
                border: "1px solid oklch(0.26 0.07 230 / 0.5)",
              }}
            >
              <div
                className="mb-2 font-display text-xs tracking-[0.3em]"
                style={{ color: "oklch(0.6 0.06 225)" }}
              >
                AVAILABLE ARMAMENTS
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "1", name: "PISTOL", dmg: 25, ammo: 12 },
                  { key: "2", name: "SHOTGUN", dmg: 60, ammo: 6 },
                  { key: "3", name: "RIFLE", dmg: 15, ammo: 30 },
                ].map((w) => (
                  <div
                    key={w.key}
                    className="flex flex-col gap-0.5 p-2"
                    style={{
                      background: "oklch(0.14 0.04 255 / 0.6)",
                      border: "1px solid oklch(0.26 0.07 230 / 0.3)",
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="font-display text-xs"
                        style={{ color: "oklch(0.5 0.04 225)" }}
                      >
                        [{w.key}]
                      </span>
                      <span
                        className="font-display text-xs font-bold"
                        style={{ color: "oklch(0.8 0.18 58)" }}
                      >
                        {w.name}
                      </span>
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.5 0.04 225)" }}
                    >
                      DMG:{w.dmg} AMM:{w.ammo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex w-full flex-col gap-4 lg:w-72">
            {/* Name input */}
            <div className="flex flex-col gap-2">
              <label
                className="font-display text-xs tracking-[0.3em]"
                style={{ color: "oklch(0.6 0.06 225)" }}
                htmlFor="callsign"
              >
                OPERATIVE CALLSIGN
              </label>
              <input
                id="callsign"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                maxLength={16}
                placeholder="ENTER CALLSIGN"
                className="font-display w-full px-3 py-2 text-sm tracking-wider outline-none"
                style={{
                  background: "oklch(0.11 0.03 255)",
                  border: "1px solid oklch(0.26 0.07 230)",
                  color: "oklch(0.88 0.12 195)",
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
                data-ocid="menu.input"
              />
            </div>

            {/* Start button */}
            <motion.button
              type="button"
              onClick={handleStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden px-8 py-4"
              style={{
                background: "oklch(0.78 0.17 195 / 0.15)",
                border: "2px solid oklch(0.78 0.17 195)",
                clipPath:
                  "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                boxShadow: "0 0 30px oklch(0.78 0.17 195 / 0.3)",
              }}
              data-ocid="menu.primary_button"
            >
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
              <div className="relative flex items-center justify-center gap-3">
                <Zap size={18} style={{ color: "oklch(0.78 0.17 195)" }} />
                <span
                  className="font-display text-lg font-black tracking-[0.3em] text-glow-cyan"
                  style={{ color: "oklch(0.78 0.17 195)" }}
                >
                  DEPLOY
                </span>
              </div>
            </motion.button>

            {/* Leaderboard */}
            {topScores.length > 0 && (
              <div
                className="flex flex-col gap-2 p-3"
                style={{
                  background: "oklch(0.11 0.03 255)",
                  border: "1px solid oklch(0.26 0.07 230 / 0.5)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Shield size={12} style={{ color: "oklch(0.78 0.17 195)" }} />
                  <span
                    className="font-display text-xs tracking-[0.3em]"
                    style={{ color: "oklch(0.6 0.06 225)" }}
                  >
                    TOP OPERATIVES
                  </span>
                </div>
                {topScores.map((entry, i) => (
                  <div
                    key={`${entry.name}-${entry.date}`}
                    className="flex items-center justify-between"
                    data-ocid={`menu.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-display text-xs"
                        style={{ color: "oklch(0.5 0.04 225)" }}
                      >
                        #{i + 1}
                      </span>
                      <span
                        className="font-display text-xs"
                        style={{
                          color:
                            i === 0
                              ? "oklch(0.8 0.18 58)"
                              : "oklch(0.7 0.04 220)",
                        }}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className="font-display text-xs"
                        style={{ color: "oklch(0.78 0.17 195)" }}
                      >
                        {entry.score}
                      </span>
                      <span
                        className="font-display text-xs"
                        style={{ color: "oklch(0.5 0.04 225)" }}
                      >
                        W{entry.wave}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            <div
              className="p-3"
              style={{
                background: "oklch(0.09 0.02 250)",
                border: "1px solid oklch(0.2 0.04 240 / 0.5)",
              }}
            >
              <div
                className="font-display text-xs tracking-[0.3em]"
                style={{ color: "oklch(0.5 0.04 225)" }}
              >
                MISSION BRIEFING
              </div>
              <ul
                className="mt-2 space-y-1"
                style={{ color: "oklch(0.45 0.04 225)", fontSize: 11 }}
              >
                <li>· Eliminate all hostiles each wave</li>
                <li>· +10 pts per kill · +50 wave bonus</li>
                <li>· Survive as long as possible</li>
                <li>· Switch weapons with 1/2/3 keys</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <footer
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        style={{ color: "oklch(0.35 0.04 225)", fontSize: 11 }}
      >
        © {new Date().getFullYear()}. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(0.55 0.08 195)" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
