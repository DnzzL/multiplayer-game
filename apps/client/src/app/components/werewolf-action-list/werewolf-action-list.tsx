import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gameActions, selectUsers } from '../../store/game.slice';

/* eslint-disable-next-line */
export interface WerewolfActionListProps {
  items: string[];
  handleDone: () => void;
}

function WerewolfActionList(props: WerewolfActionListProps) {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
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
          <input id={item} type="checkbox" name="target" /> {item}
        </label>
      ))}
      <button
        type="submit"
        disabled={!users.map((user) => user.userName).includes(selectedPlayer)}
      >
        Submit
      </button>
    </form>
  );
}

export default WerewolfActionList;
