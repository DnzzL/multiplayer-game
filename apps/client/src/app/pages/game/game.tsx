import { useEffect } from "react";
import socket from "../../socket";
import useStore, { useGameConfig, useUsers, useTurns, usePlayers } from "../../store";

export function Game() {
  const users = useUsers()
  const gameConfig = useGameConfig()
  const players = usePlayers()

  useEffect(() => {
    const shuffled = Object.keys(gameConfig)
    .filter((k) => Object(gameConfig)[k] > 0)
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
    .map(({ value }) => value)
    const players = users.map((u, idx) => ({ ...u, role: shuffled[idx] }))
    useStore.setState({players: players})
  }, [users, gameConfig])

  useEffect(() => {
    socket.emit("players", players);
  }, [players])

  return (
    <div className="game">
      <h1>Welcome to Game!</h1>
    </div>
  );
}

export default Game;
