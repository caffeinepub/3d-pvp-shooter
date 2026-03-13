import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import { Enemy } from "./Enemy";
import { ForestEnvironment } from "./ForestEnvironment";
import { Player } from "./Player";
import { SpaceEnvironment } from "./SpaceEnvironment";

function WaveController() {
  const enemies = useGameStore((s) => s.enemies);
  const wave = useGameStore((s) => s.wave);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const { completeWave, spawnWave, waveClearing } = useGameStore((s) => ({
    completeWave: s.completeWave,
    spawnWave: s.spawnWave,
    waveClearing: s.waveClearing,
  }));

  const prevLengthRef = useRef(enemies.length);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (gamePhase !== "playing") return;

    const prev = prevLengthRef.current;
    prevLengthRef.current = enemies.length;

    // Wave cleared when enemies drop to 0 from > 0 and not already clearing
    if (prev > 0 && enemies.length === 0 && !waveClearing) {
      completeWave();
      timerRef.current = setTimeout(() => {
        spawnWave(wave + 1);
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enemies.length, gamePhase, wave, completeWave, spawnWave, waveClearing]);

  return null;
}

export function Scene() {
  const enemies = useGameStore((s) => s.enemies);
  const mapType = useGameStore((s) => s.mapType);

  return (
    <>
      {mapType === "space" ? <SpaceEnvironment /> : <ForestEnvironment />}
      <Player />
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} data={enemy} />
      ))}
      <WaveController />
    </>
  );
}
