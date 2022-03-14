import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import useStore, { useGameConfig, usePlayers } from "../../store";
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

  const RoleForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const players = usePlayers();
    const gameConfig = useGameConfig()
    const onSubmit = (_: any) => {
        navigate("/game")
    }
  
    const onChange = (data: any) => {
      useStore.setState({ gameConfig: data})
    }
  
    const rolesCount = useCallback(() => {
        return Object.values(gameConfig).map(Number).reduce((a,b) => a+b)
    }, [gameConfig])
  
    return <div>
      <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(onChange)}>
      <label>Loup Garou</label>
      <input defaultValue={0} type="number" min="0" {...register("werewolf", {min:0})} />
      <label>Villageois</label>
      <input defaultValue={0} type="number" min="0" {...register("villagers", {min:0})} />
      <div>{rolesCount() !== players.length && <p>wrong nomber of roles chosen</p>}</div>
      <input type="submit" disabled={rolesCount() !== players.length}/>
    </form>
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
