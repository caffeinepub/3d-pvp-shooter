import { GameCanvas } from "./game/GameCanvas";
import { GameOver } from "./screens/GameOver";
import { MainMenu } from "./screens/MainMenu";
import { useGameStore } from "./store/gameStore";

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {gamePhase === "menu" && <MainMenu />}
      {gamePhase === "playing" && <GameCanvas />}
      {gamePhase === "gameover" && <GameOver />}
    </div>
  );
}
