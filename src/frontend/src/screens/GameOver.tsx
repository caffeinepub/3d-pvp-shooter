import { Home, RotateCcw, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { getTopScores, useGameStore } from "../store/gameStore";

export function GameOver() {
  const score = useGameStore((s) => s.score);
  const wave = useGameStore((s) => s.wave);
  const playerName = useGameStore((s) => s.playerName);
  const startGame = useGameStore((s) => s.startGame);
  const returnToMenu = useGameStore((s) => s.returnToMenu);
  const mapType = useGameStore((s) => s.mapType);

  const topScores = getTopScores().slice(0, 5);
  const playerRank =
    topScores.findIndex((s) => s.score === score && s.name === playerName) + 1;

  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden"
      style={{ background: "oklch(0.07 0.025 255)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 scanline-bg" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.3 0.15 25 / 0.6) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        data-ocid="gameover.panel"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="font-display text-xs tracking-[0.5em]"
            style={{ color: "oklch(0.65 0.22 25 / 0.8)" }}
          >
            ◆ OPERATIVE DOWN ◆
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-6xl font-black tracking-widest"
            style={{
              color: "oklch(0.65 0.22 25)",
              textShadow:
                "0 0 20px oklch(0.65 0.22 25 / 0.5), 0 0 60px oklch(0.65 0.22 25 / 0.2)",
            }}
          >
            GAME OVER
          </motion.h1>
          <div
            className="font-display text-xs tracking-[0.3em]"
            style={{ color: "oklch(0.5 0.04 225)" }}
          >
            {playerName} · {mapType.toUpperCase()} SECTOR
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full p-6"
          style={{
            background: "oklch(0.11 0.03 255)",
            border: "1px solid oklch(0.26 0.07 230 / 0.6)",
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1">
              <span
                className="font-display text-xs tracking-widest"
                style={{ color: "oklch(0.5 0.04 225)" }}
              >
                SCORE
              </span>
              <span
                className="font-display text-3xl font-black"
                style={{
                  color: "oklch(0.78 0.17 195)",
                  textShadow: "0 0 10px oklch(0.78 0.17 195 / 0.5)",
                }}
              >
                {score}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                className="font-display text-xs tracking-widest"
                style={{ color: "oklch(0.5 0.04 225)" }}
              >
                WAVES
              </span>
              <span
                className="font-display text-3xl font-black"
                style={{ color: "oklch(0.8 0.18 58)" }}
              >
                {wave}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                className="font-display text-xs tracking-widest"
                style={{ color: "oklch(0.5 0.04 225)" }}
              >
                RANK
              </span>
              <span
                className="font-display text-3xl font-black"
                style={{
                  color:
                    playerRank === 1
                      ? "oklch(0.8 0.18 58)"
                      : "oklch(0.65 0.22 145)",
                }}
              >
                {playerRank > 0 ? `#${playerRank}` : "-"}
              </span>
            </div>
          </div>

          {playerRank === 1 && (
            <div
              className="mt-4 flex items-center justify-center gap-2 py-2"
              style={{
                background: "oklch(0.8 0.18 58 / 0.1)",
                border: "1px solid oklch(0.8 0.18 58 / 0.4)",
              }}
            >
              <Trophy size={14} style={{ color: "oklch(0.8 0.18 58)" }} />
              <span
                className="font-display text-xs tracking-widest text-glow-amber"
                style={{ color: "oklch(0.8 0.18 58)" }}
              >
                NEW HIGH SCORE
              </span>
            </div>
          )}
        </motion.div>

        {topScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <div
              className="font-display mb-2 text-xs tracking-[0.3em]"
              style={{ color: "oklch(0.5 0.04 225)" }}
            >
              LEADERBOARD
            </div>
            <div
              className="flex flex-col gap-1 p-3"
              style={{
                background: "oklch(0.11 0.03 255)",
                border: "1px solid oklch(0.26 0.07 230 / 0.4)",
              }}
            >
              {topScores.map((entry, i) => (
                <div
                  key={`${entry.name}-${entry.date}`}
                  className="flex items-center justify-between py-0.5"
                  style={{
                    borderBottom:
                      i < topScores.length - 1
                        ? "1px solid oklch(0.2 0.04 240 / 0.3)"
                        : "none",
                  }}
                  data-ocid={`gameover.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-display w-4 text-xs"
                      style={{
                        color:
                          i === 0
                            ? "oklch(0.8 0.18 58)"
                            : "oklch(0.4 0.04 225)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="font-display text-xs"
                      style={{
                        color:
                          entry.name === playerName && entry.score === score
                            ? "oklch(0.78 0.17 195)"
                            : "oklch(0.7 0.04 220)",
                      }}
                    >
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-display text-xs"
                      style={{ color: "oklch(0.78 0.17 195)" }}
                    >
                      {entry.score}
                    </span>
                    <span
                      className="font-display text-xs"
                      style={{ color: "oklch(0.45 0.04 225)" }}
                    >
                      W{entry.wave}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex w-full gap-3"
        >
          <button
            type="button"
            onClick={returnToMenu}
            className="flex flex-1 items-center justify-center gap-2 px-4 py-3 transition-all hover:opacity-90"
            style={{
              background: "oklch(0.11 0.03 255)",
              border: "1px solid oklch(0.26 0.07 230)",
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
            data-ocid="gameover.secondary_button"
          >
            <Home size={16} style={{ color: "oklch(0.6 0.06 225)" }} />
            <span
              className="font-display text-sm tracking-widest"
              style={{ color: "oklch(0.6 0.06 225)" }}
            >
              MENU
            </span>
          </button>

          <motion.button
            type="button"
            onClick={startGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-[2] items-center justify-center gap-2 px-6 py-3"
            style={{
              background: "oklch(0.78 0.17 195 / 0.15)",
              border: "2px solid oklch(0.78 0.17 195)",
              clipPath:
                "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              boxShadow: "0 0 20px oklch(0.78 0.17 195 / 0.3)",
            }}
            data-ocid="gameover.primary_button"
          >
            <RotateCcw size={16} style={{ color: "oklch(0.78 0.17 195)" }} />
            <span
              className="font-display text-base font-bold tracking-[0.3em] text-glow-cyan"
              style={{ color: "oklch(0.78 0.17 195)" }}
            >
              REDEPLOY
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
