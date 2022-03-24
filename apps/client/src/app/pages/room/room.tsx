import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import List from "../../list/list";
import { gameActions, selectGameConfig, selectSelfId, selectUsers } from "../../store/game.slice";


export function Room() {
  const selfId = useSelector(selectSelfId)
  const users = useSelector(selectUsers)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(gameActions.getAllUsers())
  }, [dispatch])

  const isRoomMaster = useCallback(() => {
    console.log(selfId)
    console.log(users)
    return users && users.length > 0 && selfId === users[0].userID
  }, [selfId, users])


  const RoleForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm();
    const users = useSelector(selectUsers)
    const gameConfig = useSelector(selectGameConfig)

    const onSubmit = (_: any) => {
      dispatch(gameActions.sendGameConfig({ gameConfig }))
      navigate("/game")
    }

    const onChange = (gameConfig: any) => {
      dispatch(gameActions.setGameConfig({ gameConfig }))
    }

    const rolesCount = useCallback(() => {
      return Object.values(gameConfig).map(Number).reduce((a, b) => a + b)
    }, [gameConfig])

    return <div>
      <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(onChange)}>
        <label>Loup Garou</label>
        <input defaultValue={0} type="number" min="0" {...register("werewolf", { min: 0 })} />
        <label>Villageois</label>
        <input defaultValue={0} type="number" min="0" {...register("villager", { min: 0 })} />
        <label>Sorcier</label>
        <input defaultValue={0} type="number" min="0" {...register("sorcerer", { min: 0 })} />
        <label>Cupidon</label>
        <input defaultValue={0} type="number" min="0" {...register("cupidon", { min: 0 })} />
        <div>{rolesCount() !== users.length && <p>wrong nomber of roles chosen</p>}</div>
        <input type="submit" disabled={rolesCount() !== users.length} />
      </form>
    </div>
  }

  const WaitingConfiguration = () => {
    return <p>{users && users.length && users[0].userName} is configuring the game</p>
  }

  return (
    <div className="room">
      <h1>Users</h1>
      {<List items={users.map(u => u.userName)}></List>}
      {isRoomMaster() ? <RoleForm></RoleForm> : <WaitingConfiguration></WaitingConfiguration>}
    </div>
  );
}

export default Room;
