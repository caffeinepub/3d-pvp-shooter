import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import type { WeaponType } from "../store/gameStore";
import { useGameContext } from "./GameContext";

const JOYSTICK_RADIUS = 55;

function VirtualJoystick() {
  const outerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const { touchMoveDirRef } = useGameContext();
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (touchIdRef.current !== null) return;
      touchIdRef.current = e.changedTouches[0].identifier;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchIdRef.current === null) return;
      let found: Touch | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          found = e.changedTouches[i];
          break;
        }
      }
      if (!found) return;

      const rect = outer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = found.clientX - cx;
      const dy = found.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamp = Math.min(dist, JOYSTICK_RADIUS);
      const nx = dist > 0 ? (dx / dist) * clamp : 0;
      const ny = dist > 0 ? (dy / dist) * clamp : 0;

      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
      }

      const mag = Math.min(dist / JOYSTICK_RADIUS, 1);
      touchMoveDirRef.current = {
        x: dist > 0 ? (dx / dist) * mag : 0,
        z: dist > 0 ? (dy / dist) * mag : 0,
      };
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          break;
        }
      }
      if (touchIdRef.current === null) {
        if (knobRef.current) {
          knobRef.current.style.transform = "translate(0px, 0px)";
        }
        touchMoveDirRef.current = { x: 0, z: 0 };
      }
    };

    outer.addEventListener("touchstart", onTouchStart, { passive: false });
    outer.addEventListener("touchmove", onTouchMove, { passive: false });
    outer.addEventListener("touchend", onTouchEnd, { passive: false });
    outer.addEventListener("touchcancel", onTouchEnd, { passive: false });
    return () => {
      outer.removeEventListener("touchstart", onTouchStart);
      outer.removeEventListener("touchmove", onTouchMove);
      outer.removeEventListener("touchend", onTouchEnd);
      outer.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [touchMoveDirRef]);

  return (
    <div
      ref={outerRef}
      style={{
        position: "absolute",
        left: 24,
        bottom: 100,
        width: JOYSTICK_RADIUS * 2,
        height: JOYSTICK_RADIUS * 2,
        borderRadius: "50%",
        background: "oklch(0.07 0.025 255 / 0.55)",
        border: "2px solid oklch(0.78 0.17 195 / 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
        boxShadow: "0 0 20px oklch(0.78 0.17 195 / 0.15)",
      }}
      data-ocid="game.canvas_target"
    >
      {/* Direction indicators */}
      {[
        { label: "▲", top: 6, left: "50%", transform: "translateX(-50%)" },
        { label: "▼", bottom: 6, left: "50%", transform: "translateX(-50%)" },
        { label: "◀", left: 6, top: "50%", transform: "translateY(-50%)" },
        { label: "▶", right: 6, top: "50%", transform: "translateY(-50%)" },
      ].map((d) => (
        <span
          key={d.label}
          style={{
            position: "absolute",
            top: d.top,
            bottom: d.bottom,
            left: d.left,
            right: d.right,
            transform: d.transform,
            color: "oklch(0.78 0.17 195 / 0.35)",
            fontSize: 10,
            pointerEvents: "none",
          }}
        >
          {d.label}
        </span>
      ))}
      {/* Knob */}
      <div
        ref={knobRef}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.88 0.12 195), oklch(0.6 0.14 195))",
          border: "2px solid oklch(0.78 0.17 195)",
          boxShadow: "0 0 12px oklch(0.78 0.17 195 / 0.6)",
          pointerEvents: "none",
          transition: "transform 0.04s ease-out",
        }}
      />
    </div>
  );
}

function CameraLookArea() {
  const areaRef = useRef<HTMLDivElement>(null);
  const { yawRef, pitchRef, shouldShootRef } = useGameContext();
  const touchIdRef = useRef<number | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const startTime = useRef(0);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (touchIdRef.current !== null) return;
      const t = e.changedTouches[0];
      touchIdRef.current = t.identifier;
      lastPos.current = { x: t.clientX, y: t.clientY };
      startPos.current = { x: t.clientX, y: t.clientY };
      startTime.current = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchIdRef.current === null || !lastPos.current) return;
      let found: Touch | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          found = e.changedTouches[i];
          break;
        }
      }
      if (!found) return;

      const dx = found.clientX - lastPos.current.x;
      const dy = found.clientY - lastPos.current.y;
      yawRef.current -= dx * 0.005;
      pitchRef.current -= dy * 0.005;
      pitchRef.current = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 4, pitchRef.current),
      );
      lastPos.current = { x: found.clientX, y: found.clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          // Detect tap → shoot
          if (startPos.current) {
            const t = e.changedTouches[i];
            const dx = t.clientX - startPos.current.x;
            const dy = t.clientY - startPos.current.y;
            const moved = Math.sqrt(dx * dx + dy * dy);
            const elapsed = Date.now() - startTime.current;
            if (moved < 12 && elapsed < 300) {
              shouldShootRef.current = true;
            }
          }
          touchIdRef.current = null;
          lastPos.current = null;
          break;
        }
      }
    };

    area.addEventListener("touchstart", onTouchStart, { passive: false });
    area.addEventListener("touchmove", onTouchMove, { passive: false });
    area.addEventListener("touchend", onTouchEnd, { passive: false });
    area.addEventListener("touchcancel", onTouchEnd, { passive: false });
    return () => {
      area.removeEventListener("touchstart", onTouchStart);
      area.removeEventListener("touchmove", onTouchMove);
      area.removeEventListener("touchend", onTouchEnd);
      area.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [yawRef, pitchRef, shouldShootRef]);

  return (
    <div
      ref={areaRef}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        left: "40%",
        bottom: 160,
        touchAction: "none",
        userSelect: "none",
        // Subtle visual indicator
        background: "transparent",
      }}
    />
  );
}

function ActionButtons() {
  const { fireHeldRef, shouldJumpRef } = useGameContext();

  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    userSelect: "none",
    touchAction: "none",
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: "0.1em",
    cursor: "pointer",
  };

  const onFireStart = (e: React.TouchEvent) => {
    e.preventDefault();
    fireHeldRef.current = true;
  };
  const onFireEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    fireHeldRef.current = false;
  };
  const onJump = (e: React.TouchEvent) => {
    e.preventDefault();
    shouldJumpRef.current = true;
  };

  return (
    <div
      style={{
        position: "absolute",
        right: 24,
        bottom: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
      }}
    >
      {/* Row: JUMP + FIRE */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* JUMP */}
        <div
          style={{
            ...btnBase,
            width: 60,
            height: 60,
            background: "oklch(0.2 0.06 250 / 0.75)",
            border: "2px solid oklch(0.6 0.12 220 / 0.8)",
            color: "oklch(0.75 0.12 220)",
            boxShadow: "0 0 12px oklch(0.6 0.12 220 / 0.3)",
          }}
          onTouchStart={onJump}
          onTouchEnd={(e) => e.preventDefault()}
          data-ocid="game.button"
        >
          JUMP
        </div>

        {/* FIRE */}
        <div
          style={{
            ...btnBase,
            width: 80,
            height: 80,
            background: "oklch(0.2 0.1 25 / 0.75)",
            border: "2px solid oklch(0.65 0.22 25 / 0.9)",
            color: "oklch(0.85 0.15 25)",
            fontSize: 13,
            boxShadow:
              "0 0 20px oklch(0.65 0.22 25 / 0.4), inset 0 0 10px oklch(0.65 0.22 25 / 0.1)",
          }}
          onTouchStart={onFireStart}
          onTouchEnd={onFireEnd}
          onTouchCancel={onFireEnd}
          data-ocid="game.primary_button"
        >
          FIRE
        </div>
      </div>
    </div>
  );
}

function WeaponButtons() {
  const currentWeapon = useGameStore((s) => s.currentWeapon);

  const weapons: { key: WeaponType; label: string }[] = [
    { key: "pistol", label: "P" },
    { key: "shotgun", label: "SG" },
    { key: "rifle", label: "AR" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: 24,
        bottom: 210,
        display: "flex",
        gap: 8,
      }}
    >
      {weapons.map((w) => (
        <div
          key={w.key}
          onTouchStart={(e) => {
            e.preventDefault();
            useGameStore.getState().setCurrentWeapon(w.key);
          }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.05em",
            touchAction: "none",
            userSelect: "none",
            cursor: "pointer",
            background:
              currentWeapon === w.key
                ? "oklch(0.78 0.17 195 / 0.25)"
                : "oklch(0.11 0.03 255 / 0.7)",
            border: `2px solid ${
              currentWeapon === w.key
                ? "oklch(0.78 0.17 195 / 0.8)"
                : "oklch(0.3 0.06 230 / 0.5)"
            }`,
            color:
              currentWeapon === w.key
                ? "oklch(0.78 0.17 195)"
                : "oklch(0.55 0.05 225)",
            boxShadow:
              currentWeapon === w.key
                ? "0 0 10px oklch(0.78 0.17 195 / 0.3)"
                : "none",
          }}
          data-ocid="game.toggle"
        >
          {w.label}
        </div>
      ))}
    </div>
  );
}

export function MobileControls() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {/* Camera look + tap-to-shoot area (right side) */}
      <div style={{ pointerEvents: "auto" }}>
        <CameraLookArea />
      </div>

      {/* Virtual joystick */}
      <div style={{ pointerEvents: "auto" }}>
        <VirtualJoystick />
      </div>

      {/* Weapon selector */}
      <div style={{ pointerEvents: "auto" }}>
        <WeaponButtons />
      </div>

      {/* Fire + Jump buttons */}
      <div style={{ pointerEvents: "auto" }}>
        <ActionButtons />
      </div>

      {/* Safe area spacer for mobile bottom bars */}
      <style>{`
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .mobile-safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        }
      `}</style>
    </div>
  );
}
