import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gameActions, selectGameConfig, selectPlayers, selectUsers } from "../../store/game.slice";


export function Room() {
  const users = useSelector(selectUsers)
  const dispatch = useDispatch()

  useEffect(() => {
    // const usersListener = (users: User[]) => {
    //   dispatch(gameActions.setUsers(users))
    // };
    //   socket.on('users', usersListener);
    //   socket.emit("getUsers", socket.id)

    //   return () => {
    //     socket.off('users', usersListener);
    //   };
  }, [users, dispatch])


  const PlayerList = () => {
    return <div>
      <h1>Players</h1>
      <ul>
        {users.map((user, idx) =>
          <li key={idx}>{user.userName}</li>)}
      </ul>
    </div>
  }

  const RoleForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm();
    const players = useSelector(selectPlayers)
    const gameConfig =useSelector(selectGameConfig)
    const onSubmit = (_: any) => {
        navigate("/game")
        // socket.emit("gameconfig", gameConfig)
    }
  
    const onChange = (data: any) => dispatch(gameActions.setGameConfig(data))
  
    const rolesCount = useCallback(() => {
        return Object.values(gameConfig).map(Number).reduce((a,b) => a+b)
    }, [gameConfig])

    return <div>
      <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(onChange)}>
      <label>Loup Garou</label>
      <input defaultValue={0} type="number" min="0" {...register("werewolf", {min:0})} />
      <label>Villageois</label>
      <input defaultValue={0} type="number" min="0" {...register("villager", {min:0})} />
      <label>Sorcier</label>
      <input defaultValue={0} type="number" min="0" {...register("sorcerer", {min:0})} />
      <label>Cupidon</label>
      <input defaultValue={0} type="number" min="0" {...register("cupidon", {min:0})} />
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
