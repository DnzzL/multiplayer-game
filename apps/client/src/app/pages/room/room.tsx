import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gameActions, selectGameConfig, selectUsers } from "../../store/game.slice";


export function Room() {
  const users = useSelector(selectUsers)
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(gameActions.getAllUsers())
  }, [dispatch])


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
    const users = useSelector(selectUsers)
    const gameConfig =useSelector(selectGameConfig)
    const onSubmit = (_: any) => {
        dispatch(gameActions.sendGameConfig({gameConfig}))
        navigate("/game")
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
      <div>{rolesCount() !== users.length && <p>wrong nomber of roles chosen</p>}</div>
      <input type="submit" disabled={rolesCount() !== users.length}/>
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
