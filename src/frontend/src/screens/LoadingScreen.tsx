import { useEffect, useRef } from "react";

interface LoadingScreenProps {
  mapName?: string;
}

export function LoadingScreen({ mapName = "LOADING" }: LoadingScreenProps) {
  const dotsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (dotsRef.current) {
        count = (count + 1) % 4;
        dotsRef.current.textContent = ".".repeat(count);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "oklch(0.07 0.025 255)", zIndex: 100 }}
      data-ocid="game.loading_state"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 scanline-bg" />

      {/* Corner decorations */}
      {[
        "left-4 top-4 border-l-2 border-t-2",
        "right-4 top-4 border-r-2 border-t-2",
        "bottom-4 left-4 border-b-2 border-l-2",
        "bottom-4 right-4 border-b-2 border-r-2",
      ].map((cls) => (
        <div
          key={cls}
          className={`absolute h-10 w-10 ${cls}`}
          style={{ borderColor: "oklch(0.78 0.17 195 / 0.5)" }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated hex spinner */}
        <div className="relative h-24 w-24">
          <div
            className="absolute inset-0 animate-spin"
            style={{
              animationDuration: "3s",
              border: "2px solid oklch(0.78 0.17 195 / 0.15)",
              borderTopColor: "oklch(0.78 0.17 195)",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute inset-3 animate-spin"
            style={{
              animationDuration: "2s",
              animationDirection: "reverse",
              border: "2px solid oklch(0.8 0.18 58 / 0.15)",
              borderTopColor: "oklch(0.8 0.18 58)",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute inset-6 animate-spin"
            style={{
              animationDuration: "1.5s",
              border: "2px solid oklch(0.78 0.17 195 / 0.1)",
              borderTopColor: "oklch(0.78 0.17 195 / 0.6)",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold"
            style={{ color: "oklch(0.78 0.17 195)" }}
          >
            ◆
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="font-display text-xs tracking-[0.5em] uppercase"
            style={{ color: "oklch(0.5 0.04 225)" }}
          >
            TACTICAL ENGAGEMENT SYSTEM
          </div>
          <div
            className="font-display text-2xl font-black tracking-widest"
            style={{ color: "oklch(0.88 0.12 195)" }}
          >
            {mapName}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-px w-64 overflow-hidden"
            style={{ background: "oklch(0.2 0.04 240)" }}
          >
            <div
              className="h-full animate-[loading-bar_2s_ease-in-out_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.17 195), oklch(0.8 0.18 58), transparent)",
                width: "60%",
              }}
            />
          </div>
          <div
            className="font-display text-xs tracking-[0.4em]"
            style={{ color: "oklch(0.5 0.04 225)" }}
          >
            INITIALIZING
            <span ref={dotsRef} />
          </div>
        </div>

        {/* Status lines */}
        <div
          className="flex flex-col gap-1 text-center"
          style={{ color: "oklch(0.35 0.04 225)", fontSize: 11 }}
        >
          <div className="font-display tracking-wider">LOADING ENVIRONMENT</div>
          <div className="font-display tracking-wider">SPAWNING ENEMIES</div>
          <div className="font-display tracking-wider">PREPARING WEAPONS</div>
        </div>
      </div>
    </div>
  );
}
