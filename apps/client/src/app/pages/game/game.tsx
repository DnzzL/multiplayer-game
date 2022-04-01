import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from '../../list/list';
import {
  gameActions,
  selectIsDuringTurn,
  selectPartners,
  selectRolePlaying,
  selectSelfId,
  selectSelfRole,
  selectUsers,
} from '../../store/game.slice';

export function Game() {
  const dispatch = useDispatch();
  const selfRole = useSelector(selectSelfRole);
  const selfId = useSelector(selectSelfId);
  const users = useSelector(selectUsers);
  const isDuringTurn = useSelector(selectIsDuringTurn);
  const rolePlaying = useSelector(selectRolePlaying);
  const partners = useSelector(selectPartners);

  useEffect(() => {
    dispatch(gameActions.requestRole({ userID: selfId }));
  }, [selfId, dispatch]);

  useEffect(() => {
    dispatch(gameActions.requestPartners({ selfRole }));
  }, [selfRole, dispatch]);

  const textToSpeech = (text: string) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'fr-FR';
    synth.speak(utterThis);
  };

  const isRoomMaster = useCallback(() => {
    return users && users.length > 0 && selfId === users[0].userID;
  }, [selfId, users]);

  const handleClick = () => {
    const text = 'La nuit tombe sur le village ... Fermez vos yeux';
    textToSpeech(text);
    dispatch(gameActions.sendTurnStart());
    dispatch(gameActions.requestRolePlaying());
  };

  const handleDone = useCallback(() => {
    const text = `Les ${rolePlaying} vous pouvez fermer les yeux.`;
    textToSpeech(text);
    dispatch(gameActions.requestRolePlaying());
  }, [rolePlaying, dispatch]);

  interface WerewolfActionListProps {
    items: string[];
  }
  const WerewolfActionList = (props: WerewolfActionListProps) => {
    return (
      <form>
        {props.items.map((item) => (
          <label htmlFor={item}>
            <input id={item} type="checkbox" name="target" /> {item}
          </label>
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  };

  return (
    <div className="game">
      <h1>Players</h1>
      {<List items={users.map((u) => u.userName)}></List>}
      {selfRole && <p>You are a {selfRole}</p>}
      {isRoomMaster()
        ? !isDuringTurn && <button onClick={handleClick}>Start Turn</button>
        : null}
      {isDuringTurn && selfRole === rolePlaying && <p>You are playing</p> && (
        <button onClick={handleDone}>Done</button>
      )}
      {isDuringTurn &&
        selfRole === rolePlaying &&
        rolePlaying === 'werewolf' && (
          <WerewolfActionList
            items={users
              .filter(
                (user) =>
                  user.userID !== selfId &&
                  user.isAlive &&
                  !partners.includes(user.userID)
              )
              .map((u) => u.userName)}
          ></WerewolfActionList>
        )}
    </div>
  );
}

export default Game;
