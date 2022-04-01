import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { gameActions } from '../../store/game.slice';

export interface CupidonActionListProps {
  items: string[];
  handleDone: () => void;
}
function CupidonActionList(props: CupidonActionListProps) {
  const dispatch = useDispatch();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    selectedPlayers.includes(e.target.id)
      ? setSelectedPlayers(selectedPlayers.filter((p) => p !== e.target.id))
      : setSelectedPlayers([...selectedPlayers, e.target.id]);
  };
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      gameActions.sendPlayerBound({
        userNameA: selectedPlayers[0],
        userNameB: selectedPlayers[1],
      })
    );
    props.handleDone();
  };
  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      {props.items.map((item) => (
        <label htmlFor={item}>
          <input id={item} key={item} type="checkbox" name="kill" /> {item}
        </label>
      ))}
      <button type="submit" disabled={selectedPlayers.length !== 2}>
        Submit
      </button>
    </form>
  );
}

export default CupidonActionList;
