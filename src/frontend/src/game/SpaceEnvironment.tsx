import { Float, Stars } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

function Asteroid({ position }: { position: [number, number, number] }) {
  const scale = 0.5 + Math.random() * 1.5;
  return (
    <Float speed={0.5} floatIntensity={0.5} rotationIntensity={0.3}>
      <mesh position={position} scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#4a4a5a" roughness={0.9} metalness={0.2} />
      </mesh>
    </Float>
  );
}

export function SpaceEnvironment() {
  const asteroidPositions = useMemo<[number, number, number][]>(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const r = 25 + Math.random() * 20;
      positions.push([
        Math.cos(angle) * r,
        -2 + Math.random() * 8,
        Math.sin(angle) * r,
      ]);
    }
    return positions;
  }, []);

  const starPositions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 300;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 300;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    return arr;
  }, []);

  return (
    <>
      <color attach="background" args={["#00000a"]} />

      <Stars
        radius={100}
        depth={50}
        count={4000}
        factor={3}
        saturation={0.2}
        fade
        speed={0.5}
      />

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.4} color="#aaccff" sizeAttenuation />
      </points>

      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[40, 40, 0.5, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.4}
          emissive="#0a0a1a"
          emissiveIntensity={0.5}
        />
      </mesh>

      <gridHelper
        position={[0, 0.01, 0]}
        args={[80, 40, "#1e3a5f", "#0d1f3c"]}
      />

      {asteroidPositions.map((pos) => (
        <Asteroid
          key={`${pos[0].toFixed(1)}-${pos[2].toFixed(1)}`}
          position={pos}
        />
      ))}

      <ambientLight intensity={0.3} color="#2244aa" />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.5}
        color="#6688ff"
        castShadow
      />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#4466cc" />
      <pointLight position={[-20, 5, -20]} intensity={0.5} color="#aa44ff" />

      <mesh position={[0, 20, -60]}>
        <planeGeometry args={[120, 80]} />
        <meshBasicMaterial
          color={new THREE.Color(0.1, 0.05, 0.3)}
          transparent
          opacity={0.3}
          side={THREE.FrontSide}
        />
      </mesh>
    </>
  );
}
