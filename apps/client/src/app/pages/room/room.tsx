import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import useStore, { useAddWerewolf, usePlayers, useWerewolfCount } from "../../store";
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

  const AddWereWolfSection = () => {
    const addWerewolf = useAddWerewolf()
    return (
      <div>
        <button onClick={addWerewolf}>Add a werewolf</button>
      </div>
    )
  }

  const WereWolfCountSection = () => {
    const werewolfCount = useWerewolfCount()
    return <div>Werewolf count: {werewolfCount}</div>
  }

  const StartGameSection = () => {
    const navigate = useNavigate();
    return (
      <div>
        <button onClick={() => navigate("/game")}>Start Game</button>
      </div>
    )
  }

  return (
    <div className="room">
      <PlayerList></PlayerList>
      <AddWereWolfSection></AddWereWolfSection>
      <WereWolfCountSection></WereWolfCountSection>
      <StartGameSection></StartGameSection>
    </div>
  );
}

export default Room;
