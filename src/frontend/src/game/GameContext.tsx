import { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

export interface TouchMoveDir {
  x: number;
  z: number;
}

interface GameContextType {
  // World refs
  playerPositionRef: React.MutableRefObject<THREE.Vector3>;
  enemyObjectRefs: React.MutableRefObject<Map<string, THREE.Object3D>>;
  registerEnemy: (id: string, obj: THREE.Object3D) => void;
  unregisterEnemy: (id: string) => void;

  // Shared camera / input refs (written by both mouse and touch)
  yawRef: React.MutableRefObject<number>;
  pitchRef: React.MutableRefObject<number>;

  // Shared action refs
  shouldShootRef: React.MutableRefObject<boolean>;
  fireHeldRef: React.MutableRefObject<boolean>;
  shouldJumpRef: React.MutableRefObject<boolean>;
  touchMoveDirRef: React.MutableRefObject<TouchMoveDir>;

  // Device
  isMobile: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

function detectMobile(): boolean {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

export function GameContextProvider({ children }: { children: ReactNode }) {
  const playerPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const enemyObjectRefs = useRef<Map<string, THREE.Object3D>>(new Map());

  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const shouldShootRef = useRef(false);
  const fireHeldRef = useRef(false);
  const shouldJumpRef = useRef(false);
  const touchMoveDirRef = useRef<TouchMoveDir>({ x: 0, z: 0 });

  const isMobile = detectMobile();

  function registerEnemy(id: string, obj: THREE.Object3D) {
    enemyObjectRefs.current.set(id, obj);
  }

  function unregisterEnemy(id: string) {
    enemyObjectRefs.current.delete(id);
  }

  return (
    <GameContext.Provider
      value={{
        playerPositionRef,
        enemyObjectRefs,
        registerEnemy,
        unregisterEnemy,
        yawRef,
        pitchRef,
        shouldShootRef,
        fireHeldRef,
        shouldJumpRef,
        touchMoveDirRef,
        isMobile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx)
    throw new Error("useGameContext must be within GameContextProvider");
  return ctx;
}
