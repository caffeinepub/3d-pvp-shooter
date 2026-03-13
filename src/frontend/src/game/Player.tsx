import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { WEAPONS, useGameStore } from "../store/gameStore";
import { isAncestor } from "./Enemy";
import { useGameContext } from "./GameContext";

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const muzzleFlashRef = useRef<THREE.PointLight>(null);
  const muzzleFlashTimer = useRef(0);
  const lastShotTime = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const verticalVelocity = useRef(0);
  const isOnGround = useRef(true);

  const { camera } = useThree();
  const {
    playerPositionRef,
    enemyObjectRefs,
    yawRef,
    pitchRef,
    shouldShootRef,
    fireHeldRef,
    shouldJumpRef,
    touchMoveDirRef,
  } = useGameContext();

  const mapType = useGameStore((s) => s.mapType);

  // Keyboard + mouse input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["Space", "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)) {
        e.preventDefault();
      }
      keys.current[e.code] = true;

      if (e.code === "Digit1")
        useGameStore.getState().setCurrentWeapon("pistol");
      if (e.code === "Digit2")
        useGameStore.getState().setCurrentWeapon("shotgun");
      if (e.code === "Digit3")
        useGameStore.getState().setCurrentWeapon("rifle");

      if (e.code === "Space" && isOnGround.current) {
        verticalVelocity.current = 6;
        isOnGround.current = false;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yawRef.current -= e.movementX * 0.002;
        pitchRef.current -= e.movementY * 0.002;
        pitchRef.current = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 4, pitchRef.current),
        );
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && document.pointerLockElement) {
        shouldShootRef.current = true;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [yawRef, pitchRef, shouldShootRef]);

  const performShoot = useCallback(() => {
    const state = useGameStore.getState();
    if (state.gamePhase !== "playing") return;

    const weapon = WEAPONS[state.currentWeapon];
    const now = Date.now();
    if (now - lastShotTime.current < weapon.fireRate) return;
    if (!state.decrementAmmo()) return;

    lastShotTime.current = now;

    if (muzzleFlashRef.current) {
      muzzleFlashRef.current.intensity = 10;
      muzzleFlashTimer.current = 0.08;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    raycaster.far = 100;

    const enemyObjects = Array.from(enemyObjectRefs.current.values());
    if (enemyObjects.length === 0) return;

    const intersects = raycaster.intersectObjects(enemyObjects, true);
    if (intersects.length > 0) {
      const hitObject = intersects[0].object;
      for (const [id, obj] of enemyObjectRefs.current) {
        if (isAncestor(obj, hitObject)) {
          useGameStore.getState().damageEnemy(id, weapon.damage);
          break;
        }
      }
    }
  }, [camera, enemyObjectRefs]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Handle touch jump
    if (shouldJumpRef.current) {
      shouldJumpRef.current = false;
      if (isOnGround.current) {
        verticalVelocity.current = 6;
        isOnGround.current = false;
      }
    }

    // Handle shooting (single-shot or held fire)
    if (shouldShootRef.current) {
      shouldShootRef.current = false;
      performShoot();
    } else if (fireHeldRef.current) {
      performShoot();
    }

    // Muzzle flash timer
    if (muzzleFlashRef.current && muzzleFlashTimer.current > 0) {
      muzzleFlashTimer.current -= delta;
      if (muzzleFlashTimer.current <= 0) {
        muzzleFlashRef.current.intensity = 0;
        muzzleFlashTimer.current = 0;
      }
    }

    // Movement vectors based on camera yaw
    const speed = 8;
    const forward = new THREE.Vector3(
      -Math.sin(yawRef.current),
      0,
      -Math.cos(yawRef.current),
    );
    const right = new THREE.Vector3(
      Math.cos(yawRef.current),
      0,
      -Math.sin(yawRef.current),
    );

    const moveDir = new THREE.Vector3();

    // Keyboard input
    if (keys.current.KeyW) moveDir.add(forward);
    if (keys.current.KeyS) moveDir.sub(forward);
    if (keys.current.KeyA) moveDir.sub(right);
    if (keys.current.KeyD) moveDir.add(right);

    // Touch joystick input (x = strafe, z = forward/back, +z = screen-down = backward)
    const td = touchMoveDirRef.current;
    if (Math.abs(td.x) > 0.05 || Math.abs(td.z) > 0.05) {
      moveDir.addScaledVector(right, td.x);
      moveDir.addScaledVector(forward, -td.z);
    }

    if (moveDir.length() > 0) {
      moveDir.normalize().multiplyScalar(speed * delta);
      group.position.add(moveDir);
    }

    // Gravity + jumping
    if (!isOnGround.current) {
      verticalVelocity.current -= 18 * delta;
      group.position.y += verticalVelocity.current * delta;
    }

    if (group.position.y <= 0) {
      group.position.y = 0;
      verticalVelocity.current = 0;
      isOnGround.current = true;
    }

    // Arena boundary
    const maxDist = 38;
    const distFromCenter = Math.sqrt(
      group.position.x ** 2 + group.position.z ** 2,
    );
    if (distFromCenter > maxDist) {
      const scale = maxDist / distFromCenter;
      group.position.x *= scale;
      group.position.z *= scale;
    }

    playerPositionRef.current.copy(group.position);

    if (moveDir.length() > 0.01) {
      group.rotation.y = yawRef.current;
    }

    // Third-person camera
    const camOffset = new THREE.Vector3(0, 3, 6);
    camOffset.applyEuler(new THREE.Euler(0, yawRef.current, 0));
    camera.position.copy(group.position).add(camOffset);
    camera.rotation.order = "YXZ";
    camera.rotation.y = yawRef.current;
    camera.rotation.x = pitchRef.current - 0.2;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.9, 4, 8]} />
        <meshStandardMaterial
          color={mapType === "space" ? "#0af" : "#3a6b3a"}
          roughness={0.4}
          metalness={0.6}
          emissive={mapType === "space" ? "#002244" : "#001100"}
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color={mapType === "space" ? "#2244aa" : "#2d5016"}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0.35, 1.0, -0.5]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.7]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
      </mesh>
      <pointLight
        ref={muzzleFlashRef}
        position={[0.35, 1.0, -1.0]}
        color="#ffaa44"
        intensity={0}
        distance={5}
      />
    </group>
  );
}
