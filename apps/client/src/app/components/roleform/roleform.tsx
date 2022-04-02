import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { gameActions, selectGameConfig } from '../../store/game.slice';

export interface RoleFormProps {
  userCount: number;
}

export function RoleForm(props: RoleFormProps) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const gameConfig = useSelector(selectGameConfig);

  const onSubmit = (_: any) => {
    dispatch(gameActions.sendGameConfig({ gameConfig }));
    dispatch(gameActions.sendGameStart());
    reset();
  };

  const onChange = (gameConfig: any) => {
    dispatch(gameActions.setGameConfig({ gameConfig }));
  };

  const rolesCount = useCallback(() => {
    return Object.values(gameConfig)
      .map(Number)
      .reduce((a, b) => a + b);
  }, [gameConfig]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(onChange)}>
        <label>Loup Garou</label>
        <input
          defaultValue={0}
          type="number"
          min="0"
          {...register('werewolf', { min: 0 })}
        />
        <label>Villageois</label>
        <input
          defaultValue={0}
          type="number"
          min="0"
          {...register('villager', { min: 0 })}
        />
        <label>Sorcier</label>
        <input
          defaultValue={0}
          type="number"
          min="0"
          {...register('sorcerer', { min: 0 })}
        />
        <label>Cupidon</label>
        <input
          defaultValue={0}
          type="number"
          min="0"
          {...register('cupidon', { min: 0 })}
        />
        <div>
          {rolesCount() !== props.userCount && (
            <p>mauvais nombre de roles choisis</p>
          )}
        </div>
        <input
          type="submit"
          value="Commencer"
          disabled={rolesCount() !== props.userCount}
        />
      </form>
    </div>
  );
}

export default RoleForm;
