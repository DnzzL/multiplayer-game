import { SorcererAction } from '@loup-garou/types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { gameActions } from '../../store/game.slice';

export interface SorcererActionListProps {
  players: string[];
  actions: string[];
  handleDone: () => void;
}

function SorcererActionList(props: SorcererActionListProps) {
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState<SorcererAction>();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    if (e.target.name === 'action') {
      if (e.target.id === 'pass') {
        setSelectedPlayer('');
      }
      setSelectedAction(e.target.id as SorcererAction);
    } else {
      setSelectedPlayer(e.target.id);
    }
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedAction === 'kill') {
      dispatch(gameActions.sendPlayerKilled({ userName: selectedPlayer }));
    }
    if (selectedAction === 'revive') {
      dispatch(gameActions.sendPlayerRevived({ userName: selectedPlayer }));
    }
    props.handleDone();
  };

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      {props.actions.map((item) => (
        <label htmlFor={item}>
          <input id={item} key={`action-${item}`} type="radio" name="action" />{' '}
          {item}
        </label>
      ))}
      {selectedAction !== 'pass'
        ? props.players.map((item) => (
            <label htmlFor={item}>
              <input
                id={item}
                key={`target-${item}`}
                type="radio"
                name="target"
              />{' '}
              {item}
            </label>
          ))
        : null}
      <button
        type="submit"
        disabled={
          selectedAction !== 'pass'
            ? selectedPlayer.length !== 0
            : selectedPlayer.length !== 1
        }
      >
        Finish
      </button>
    </form>
  );
}

export default SorcererActionList;
