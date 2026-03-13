import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGameStore } from "../store/gameStore";
import type { EnemyData } from "../store/gameStore";
import { useGameContext } from "./GameContext";

function SpaceBotMesh() {
  return (
    <group>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial
          color="#cc2222"
          emissive="#ff0000"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.08, 8, 16]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff2222"
          emissiveIntensity={1}
        />
      </mesh>
      {/* Eye */}
      <mesh position={[0, 0, 0.45]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Glow light */}
      <pointLight color="#ff2200" intensity={0.8} distance={3} />
    </group>
  );
}

function ForestSoldierMesh() {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 0.7, 4, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#d2691e" roughness={0.7} />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.31, 8, 6]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Arms */}
      <mesh position={[0.4, 0.6, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.1, 0.5, 4, 6]} />
        <meshStandardMaterial color="#6b3410" roughness={0.8} />
      </mesh>
      <mesh position={[-0.4, 0.6, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.1, 0.5, 4, 6]} />
        <meshStandardMaterial color="#6b3410" roughness={0.8} />
      </mesh>
      {/* Glow on damage */}
      <pointLight color="#ff6600" intensity={0.3} distance={2} />
    </group>
  );
}

function isAncestor(ancestor: THREE.Object3D, child: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = child;
  while (current) {
    if (current === ancestor) return true;
    current = current.parent;
  }
  return false;
}

export { isAncestor };

export function Enemy({ data }: { data: EnemyData }) {
  const groupRef = useRef<THREE.Group>(null);
  const { playerPositionRef, registerEnemy, unregisterEnemy } =
    useGameContext();
  const lastAttackTime = useRef(0);
  const mapType = useGameStore((s) => s.mapType);

  useEffect(() => {
    const group = groupRef.current;
    if (group) {
      registerEnemy(data.id, group);
    }
    return () => unregisterEnemy(data.id);
  }, [data.id, registerEnemy, unregisterEnemy]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const playerPos = playerPositionRef.current;
    const dx = playerPos.x - group.position.x;
    const dz = playerPos.z - group.position.z;
    const distSq = dx * dx + dz * dz;
    const dist = Math.sqrt(distSq);

    const wave = useGameStore.getState().wave;
    const speed = 2.5 + wave * 0.2;

    if (dist > 1.8) {
      group.position.x += (dx / dist) * speed * delta;
      group.position.z += (dz / dist) * speed * delta;
    } else {
      const now = Date.now();
      if (now - lastAttackTime.current > 1000) {
        lastAttackTime.current = now;
        useGameStore.getState().takeDamage(10);
      }
    }

    // Float slightly above ground + face player
    group.position.y = mapType === "space" ? 0.5 : 0;
    if (dist > 0.1) {
      group.lookAt(
        new THREE.Vector3(playerPos.x, group.position.y, playerPos.z),
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[data.spawnX, mapType === "space" ? 0.5 : 0, data.spawnZ]}
    >
      {mapType === "space" ? <SpaceBotMesh /> : <ForestSoldierMesh />}
    </group>
  );
}
