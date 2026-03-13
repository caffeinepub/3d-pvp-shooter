import { GameCanvas } from "./game/GameCanvas";
import { GameOver } from "./screens/GameOver";
import { LoadingScreen } from "./screens/LoadingScreen";
import { MainMenu } from "./screens/MainMenu";
import { useGameStore } from "./store/gameStore";

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const mapType = useGameStore((s) => s.mapType);

  const mapName = mapType === "space" ? "VOID STATION" : "VERDANT SIEGE";

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {gamePhase === "menu" && <MainMenu />}
      {(gamePhase === "loading" || gamePhase === "playing") && (
        <>
          {gamePhase === "loading" && <LoadingScreen mapName={mapName} />}
          <GameCanvas />
        </>
      )}
      {gamePhase === "gameover" && <GameOver />}
    </div>
  );
}
