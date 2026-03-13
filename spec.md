# 3D PvP Shooter

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- 3D browser-based shooter game using React Three Fiber / Three.js
- Two maps: Space (asteroid field, dark sky) and Forest (trees, terrain)
- Third-person camera following the player
- Single-player vs AI enemies (real-time multiplayer is not supported on platform; AI bots simulate PvP)
- Multiple weapons: Pistol, Shotgun, Assault Rifle -- each with different fire rate/damage
- Health bar, ammo counter, score display, wave counter HUD
- Enemy wave system: enemies spawn in waves, increasing in difficulty
- Player movement: WASD + mouse aim, space to jump
- Shooting mechanics with projectile or raycast hit detection
- Death/respawn system
- High score tracking stored on backend
- Main menu with map selection and start game button
- Game over screen with score summary

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Store high scores (player name, score, map)
2. Frontend: React Three Fiber canvas game
   - Main menu screen (map select, start)
   - Space map scene (dark skybox, asteroids, platform)
   - Forest map scene (ground plane, trees, ambient lighting)
   - Player character (capsule mesh) with third-person camera
   - WASD movement + mouse look
   - Weapon system: 3 weapons, switch with 1/2/3 keys
   - Enemy AI: patrol/chase/attack behavior
   - Wave spawner
   - HUD overlay (health, ammo, score, wave)
   - Game over + high score submit screen
