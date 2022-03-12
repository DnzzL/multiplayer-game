import { useCallback, useEffect } from "react";
import socket from "../socket";
import useStore from "../store";
import { Player } from "../types";

export function Room() {
  const players = useStore((state) => state.players)

  useEffect(() => {
    socket.on("user connected", (player: Player) => {
      useStore.setState({ players: [...players, player] })
    });
  }, [players])

  const PlayerList = () => {
    return <ul>
      {players.map((player, idx) =>
        <li key={idx}>{player.userName}</li>)}
    </ul>
  }
  return (
    <div className="room">
      <PlayerList></PlayerList>
    </div>
  );
}

export default Room;
