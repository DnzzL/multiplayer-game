import { useEffect } from "react";
import useStore, { useGameConfig, useUsers, useTurns } from "../../store";

export function Game() {
  const users = useUsers()
  const gameConfig = useGameConfig()
  const turns = useTurns()

  useEffect(() => {
    const shuffled = Object.keys(gameConfig)
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
    .map(({ value }) => value)
    const players = users.map((u, idx) => ({ ...u, role: shuffled[idx] }))
    useStore.setState({players: players})
  }, [users, gameConfig])

  return (
    <div className="game">
      <h1>Welcome to Game!</h1>
    </div>
  );
}

export default Game;
