import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useStore, { usePlayers, useGameConfig } from "../../store";


export function RoleForm() {
  const navigate = useNavigate();
  const players = usePlayers();
  const gameConfig = useGameConfig()
  const { register, handleSubmit } = useForm();
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

export default RoleForm;