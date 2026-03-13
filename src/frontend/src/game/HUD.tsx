import { useEffect, useState } from "react";
import { WEAPONS, useGameStore } from "../store/gameStore";

function HealthBar({ health, compact }: { health: number; compact?: boolean }) {
  const pct = Math.max(0, health);
  const color =
    pct > 60
      ? "oklch(0.65 0.22 145)"
      : pct > 30
        ? "oklch(0.8 0.18 58)"
        : "oklch(0.65 0.22 25)";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className="font-display text-xs tracking-widest"
          style={{
            color: "oklch(0.6 0.06 225)",
            fontSize: compact ? 9 : undefined,
          }}
        >
          HP
        </span>
        <span
          className="font-display font-bold"
          style={{ color, fontSize: compact ? 11 : 14 }}
        >
          {health}
        </span>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          height: compact ? 4 : 8,
          width: compact ? 90 : 160,
          background: "oklch(0.15 0.04 250)",
          clipPath:
            "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
        }}
      >
        <div
          className="absolute inset-0 h-full transition-all duration-200"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

function WaveAnnouncement({ wave }: { wave: number }) {
  const [visible, setVisible] = useState(false);
  const [displayWave, setDisplayWave] = useState(wave);

  useEffect(() => {
    if (wave > 0) {
      setDisplayWave(wave);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(t);
    }
  }, [wave]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-1/3 flex justify-center"
      style={{ animation: "fadeInOut 2.5s ease-in-out" }}
    >
      <div
        className="px-6 py-3"
        style={{
          background: "oklch(0.07 0.025 255 / 0.85)",
          border: "1px solid oklch(0.78 0.17 195 / 0.5)",
          clipPath:
            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
          boxShadow: "0 0 40px oklch(0.78 0.17 195 / 0.3)",
        }}
      >
        <div
          className="font-display text-xs tracking-[0.3em]"
          style={{ color: "oklch(0.6 0.06 225)" }}
        >
          INCOMING WAVE
        </div>
        <div
          className="font-display text-4xl font-black tracking-widest text-glow-cyan"
          style={{ color: "oklch(0.78 0.17 195)" }}
        >
          {displayWave.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

export function HUD({ isMobile = false }: { isMobile?: boolean }) {
  const playerHealth = useGameStore((s) => s.playerHealth);
  const currentWeapon = useGameStore((s) => s.currentWeapon);
  const ammo = useGameStore((s) => s.ammo);
  const score = useGameStore((s) => s.score);
  const wave = useGameStore((s) => s.wave);
  const enemies = useGameStore((s) => s.enemies);
  const waveClearing = useGameStore((s) => s.waveClearing);

  const weaponConfig = WEAPONS[currentWeapon];
  const maxAmmo = weaponConfig.maxAmmo;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div
            className="h-1 w-1 rounded-full"
            style={{
              background: "oklch(0.78 0.17 195)",
              boxShadow: "0 0 6px oklch(0.78 0.17 195)",
            }}
          />
          {[
            [-18, "left"],
            [4, "right"],
          ].map(([offset, side]) => (
            <div
              key={String(side)}
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                width: 14,
                height: 1,
                [String(side)]: Number(offset),
                background: "oklch(0.78 0.17 195 / 0.7)",
              }}
            />
          ))}
          {[
            [-18, "top"],
            [4, "bottom"],
          ].map(([offset, side]) => (
            <div
              key={String(side)}
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                height: 14,
                width: 1,
                [String(side)]: Number(offset),
                background: "oklch(0.78 0.17 195 / 0.7)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Top-left: Health + Weapon */}
      <div
        className="absolute left-4 top-4 flex flex-col gap-2 p-2"
        style={{
          background: "oklch(0.07 0.025 255 / 0.75)",
          border: "1px solid oklch(0.78 0.17 195 / 0.2)",
          backdropFilter: "blur(8px)",
          clipPath:
            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        }}
      >
        <HealthBar health={playerHealth} compact={isMobile} />

        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span
              className="font-display tracking-widest"
              style={{
                color: "oklch(0.6 0.06 225)",
                fontSize: isMobile ? 8 : 10,
              }}
            >
              WPN
            </span>
            <span
              className="font-display font-bold"
              style={{
                color: "oklch(0.8 0.18 58)",
                fontSize: isMobile ? 10 : 13,
              }}
            >
              {isMobile ? weaponConfig.name.slice(0, 6) : weaponConfig.name}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span
              className="font-display tracking-widest"
              style={{
                color: "oklch(0.6 0.06 225)",
                fontSize: isMobile ? 8 : 10,
              }}
            >
              AMO
            </span>
            <span
              className="font-display font-bold"
              style={{
                color:
                  ammo === 0 ? "oklch(0.65 0.22 25)" : "oklch(0.92 0.02 220)",
                fontSize: isMobile ? 13 : 18,
              }}
            >
              {ammo}
              <span
                style={{
                  color: "oklch(0.5 0.04 225)",
                  fontSize: isMobile ? 9 : 11,
                }}
              >
                /{maxAmmo}
              </span>
            </span>
          </div>
        </div>

        {/* Weapon selector (desktop only — mobile has dedicated buttons) */}
        {!isMobile && (
          <div className="flex gap-1">
            {(["pistol", "shotgun", "rifle"] as const).map((w, i) => (
              <div
                key={w}
                className="flex items-center gap-1 px-1.5 py-0.5"
                style={{
                  background:
                    currentWeapon === w
                      ? "oklch(0.78 0.17 195 / 0.2)"
                      : "transparent",
                  border: `1px solid ${
                    currentWeapon === w
                      ? "oklch(0.78 0.17 195 / 0.6)"
                      : "oklch(0.3 0.05 230 / 0.4)"
                  }`,
                }}
              >
                <span
                  className="font-display text-xs"
                  style={{ color: "oklch(0.5 0.04 225)" }}
                >
                  [{i + 1}]
                </span>
                <span
                  className="font-display"
                  style={{
                    color:
                      currentWeapon === w
                        ? "oklch(0.78 0.17 195)"
                        : "oklch(0.45 0.05 225)",
                    fontSize: 9,
                    letterSpacing: "0.05em",
                  }}
                >
                  {w.toUpperCase().slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top-right: Score + Wave */}
      <div
        className="absolute right-4 top-4 flex flex-col items-end gap-1 p-2"
        style={{
          background: "oklch(0.07 0.025 255 / 0.75)",
          border: "1px solid oklch(0.78 0.17 195 / 0.2)",
          backdropFilter: "blur(8px)",
          clipPath:
            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
        }}
      >
        <div className="flex flex-col items-end">
          <span
            className="font-display tracking-widest"
            style={{
              color: "oklch(0.6 0.06 225)",
              fontSize: isMobile ? 9 : 11,
            }}
          >
            SCORE
          </span>
          <span
            className="font-display font-black text-glow-cyan"
            style={{
              color: "oklch(0.78 0.17 195)",
              fontSize: isMobile ? 16 : 24,
            }}
          >
            {score.toString().padStart(6, "0")}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span
            className="font-display tracking-widest"
            style={{
              color: "oklch(0.6 0.06 225)",
              fontSize: isMobile ? 9 : 11,
            }}
          >
            WAVE
          </span>
          <span
            className="font-display font-bold"
            style={{
              color: "oklch(0.8 0.18 58)",
              fontSize: isMobile ? 14 : 20,
            }}
          >
            {wave.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span
            className="font-display tracking-widest"
            style={{
              color: "oklch(0.6 0.06 225)",
              fontSize: isMobile ? 9 : 11,
            }}
          >
            HOSTILES
          </span>
          <span
            className="font-display font-bold"
            style={{
              color:
                enemies.length > 0
                  ? "oklch(0.65 0.22 25)"
                  : "oklch(0.65 0.22 145)",
              fontSize: isMobile ? 13 : 16,
            }}
          >
            {waveClearing ? "CLR" : enemies.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Desktop controls hint */}
      {!isMobile && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2"
          style={{
            background: "oklch(0.07 0.025 255 / 0.6)",
            border: "1px solid oklch(0.78 0.17 195 / 0.1)",
            backdropFilter: "blur(4px)",
          }}
        >
          <span
            className="font-display text-xs tracking-widest"
            style={{ color: "oklch(0.4 0.04 225)" }}
          >
            WASD MOVE · MOUSE AIM · LMB SHOOT · 1/2/3 WEAPON · SPACE JUMP
          </span>
        </div>
      )}

      {/* Wave announcement */}
      <WaveAnnouncement wave={wave} />

      {/* Wave clearing banner */}
      {waveClearing && (
        <div
          className="absolute inset-x-0 flex justify-center"
          style={{ bottom: isMobile ? 260 : 80 }}
        >
          <div
            className="px-6 py-2"
            style={{
              background: "oklch(0.07 0.025 255 / 0.8)",
              border: "1px solid oklch(0.65 0.22 145 / 0.5)",
            }}
          >
            <span
              className="font-display text-sm tracking-widest"
              style={{ color: "oklch(0.65 0.22 145)" }}
            >
              WAVE CLEAR — NEXT WAVE INCOMING...
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.95); }
          15% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
