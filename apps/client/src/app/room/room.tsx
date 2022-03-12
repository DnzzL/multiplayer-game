import { useEffect } from "react";
import roles from "../../assets/roles.json";
import socket from "../socket";
import useStore, { usePlayers } from "../store";
import { Player } from "../types";

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

  const RoleList = () => {
    return <div>
      <h1>Roles</h1>
      <div>
        {roles.map(role =>
          <div><h2>{role.name}</h2>
            <p>{role.description}</p></div>)}
      </div>
    </div>
  }

  return (
    <div className="room">
      <PlayerList></PlayerList>
      <RoleList></RoleList>
    </div>
  );
}

export default Room;
