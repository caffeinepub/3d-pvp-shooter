import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { GameContextProvider, useGameContext } from "./GameContext";
import { HUD } from "./HUD";
import { MobileControls } from "./MobileControls";
import { Scene } from "./Scene";

function usePointerLockState() {
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    const onChange = () => setLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);
  return locked;
}

function PointerLockPrompt() {
  const isLocked = usePointerLockState();
  const { isMobile } = useGameContext();

  if (isLocked || isMobile) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ background: "oklch(0.07 0.025 255 / 0.7)" }}
    >
      <div
        className="flex flex-col items-center gap-3 p-8 text-center"
        style={{
          background: "oklch(0.11 0.03 255 / 0.9)",
          border: "1px solid oklch(0.78 0.17 195 / 0.4)",
          clipPath:
            "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
          boxShadow: "0 0 40px oklch(0.78 0.17 195 / 0.2)",
        }}
      >
        <div
          className="font-display text-lg font-bold tracking-widest"
          style={{ color: "oklch(0.78 0.17 195)" }}
        >
          CLICK TO ENGAGE
        </div>
        <div
          className="font-display text-xs tracking-widest"
          style={{ color: "oklch(0.5 0.04 225)" }}
        >
          CLICK TO LOCK MOUSE · ESC TO PAUSE
        </div>
      </div>
    </div>
  );
}

function GameCanvasInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const { isMobile } = useGameContext();

  // Request pointer lock on click (desktop only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return;

    const onClick = () => {
      if (gamePhase === "playing" && !document.pointerLockElement) {
        container.requestPointerLock();
      }
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [gamePhase, isMobile]);

  // Release pointer lock when not playing
  useEffect(() => {
    if (gamePhase !== "playing" && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [gamePhase]);

  useEffect(() => {
    return () => {
      if (document.pointerLockElement) document.exitPointerLock();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        width: "100vw",
        height: "100dvh",
        cursor: isMobile ? "default" : "crosshair",
        touchAction: "none",
        overflow: "hidden",
      }}
      data-ocid="game.canvas_target"
    >
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        shadows
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>

      {/* DOM HUD overlay */}
      {gamePhase === "playing" && <HUD isMobile={isMobile} />}

      {/* Mobile virtual controls */}
      {gamePhase === "playing" && isMobile && <MobileControls />}

      {/* Desktop pointer lock prompt */}
      {gamePhase === "playing" && !isMobile && <PointerLockPrompt />}
    </div>
  );
}

export function GameCanvas() {
  return (
    <GameContextProvider>
      <GameCanvasInner />
    </GameContextProvider>
  );
}
