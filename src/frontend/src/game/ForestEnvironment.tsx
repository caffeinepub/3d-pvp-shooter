import { Sky } from "@react-three/drei";
import { useMemo } from "react";

function Tree({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
        <meshStandardMaterial color="#5c3d1e" roughness={1} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 7]} />
        <meshStandardMaterial color="#1a5c1a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <coneGeometry args={[0.9, 1.8, 7]} />
        <meshStandardMaterial color="#1e6b1e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.7, 0]} castShadow>
        <coneGeometry args={[0.6, 1.4, 7]} />
        <meshStandardMaterial color="#236e23" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function ForestEnvironment() {
  const trees = useMemo(() => {
    const result: {
      pos: [number, number, number];
      scale: number;
      key: string;
    }[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 8 + Math.random() * 40;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const scale = 0.7 + Math.random() * 0.8;
      result.push({
        pos: [x, 0, z],
        scale,
        key: `tree-${i}-${x.toFixed(2)}-${z.toFixed(2)}`,
      });
    }
    return result;
  }, []);

  const groundPatches = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2;
      const r = 5 + Math.random() * 15;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const w = 2 + Math.random() * 3;
      const d = 2 + Math.random() * 3;
      const rot = Math.random() * Math.PI;
      return { x, z, w, d, rot, key: `patch-${i}` };
    });
  }, []);

  return (
    <>
      <color attach="background" args={["#1a2f1a"]} />

      <Sky
        sunPosition={[50, 30, -10]}
        turbidity={6}
        rayleigh={0.5}
        mieCoefficient={0.01}
        mieDirectionalG={0.7}
      />

      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2d5a1e" roughness={1} />
      </mesh>

      {groundPatches.map((p) => (
        <mesh
          key={p.key}
          position={[p.x, 0, p.z]}
          rotation={[-Math.PI / 2, 0, p.rot]}
        >
          <planeGeometry args={[p.w, p.d]} />
          <meshStandardMaterial
            color="#1a4a10"
            roughness={1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {trees.map((t) => (
        <Tree key={t.key} position={t.pos} scale={t.scale} />
      ))}

      <ambientLight intensity={0.5} color="#88bb88" />
      <directionalLight
        position={[50, 60, -20]}
        intensity={1.8}
        color="#ffffcc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={150}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#aaffaa" />
      <hemisphereLight args={["#aaffaa", "#224422", 0.6]} />

      <fog attach="fog" args={["#1a2f1a", 30, 120]} />
    </>
  );
}
