import { useEffect } from "react";
import socket from "../../socket";
import useStore, { useGameConfig, useUsers, useTurns, usePlayers } from "../../store";

export function Game() {
  const players = usePlayers()

  useEffect(() => {
    socket.emit("players", players);
    console.log(players)
  }, [players])

  return (
    <div className="game">
      <h1>Welcome to Game!</h1>
    </div>
  );
}

export default Game;
