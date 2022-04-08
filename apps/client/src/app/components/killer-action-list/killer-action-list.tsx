import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { gameActions } from '../../store/game.slice';

export interface KillerActionListProps {
  items: string[];
  handleDone: () => void;
}

function KillerActionList(props: KillerActionListProps) {
  const dispatch = useDispatch();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setSelectedPlayer(e.target.id);
  };
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(gameActions.sendPlayerKilled({ userName: selectedPlayer }));
    props.handleDone();
  };

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      {props.items.map((item) => (
        <label htmlFor={item}>
          <input id={item} type="radio" name="target" /> {item}
        </label>
      ))}
      <button type="submit" disabled={selectedPlayer.length !== 1}>
        Finish
      </button>
    </form>
  );
}

export default KillerActionList;
