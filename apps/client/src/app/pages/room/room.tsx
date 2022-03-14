import { useEffect } from "react";
import RoleForm from "../../components/roleform/roleform";
import socket from "../../socket";
import useStore, { usePlayers } from "../../store";
import { Player } from "../../types";

export function Room() {
  const players = usePlayers();

  useEffect(() => {
      socket.on("players", (players: Player[]) => {
        useStore.setState({
          players
        })
      });
  }, [])

  useEffect(() => {
    socket.on("user connected", (player: Player) => {
      useStore.setState({ players: [...players, player] })
    });
  }, [players])

  const PlayerList = () => {
    return <div>
      <h1>Players</h1>
      <ul>
        {players.map((player, idx) =>
          <li key={idx}>{player.userName}</li>)}
      </ul>
    </div>
  }

  return (
    <div className="room">
      <PlayerList></PlayerList>
      <RoleForm></RoleForm>
    </div>
  );
}

export default Room;
