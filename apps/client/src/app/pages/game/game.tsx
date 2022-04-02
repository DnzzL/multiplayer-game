import { translatedRoles } from '@loup-garou/types';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CupidonActionList from '../../components/cupidon-action-list/cupidon-action-list';
import List from '../../components/list/list';
import SorcererActionList from '../../components/sorcerer-action-list/sorcerer-action-list';
import WerewolfActionList from '../../components/werewolf-action-list/werewolf-action-list';
import {
  gameActions,
  selectIsDuringTurn,
  selectPartners,
  selectRolePlaying,
  selectSelfId,
  selectSelfRole,
  selectSelfUser,
  selectUsers,
  selectWinner,
} from '../../store/game.slice';
import { textToSpeech } from '../../utils';

export function Game() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selfRole = useSelector(selectSelfRole);
  const selfId = useSelector(selectSelfId);
  const users = useSelector(selectUsers);
  const selfUser = useSelector(selectSelfUser);
  const isDuringTurn = useSelector(selectIsDuringTurn);
  const rolePlaying = useSelector(selectRolePlaying);
  const partners = useSelector(selectPartners);
  const winner = useSelector(selectWinner);

  useEffect(() => {
    dispatch(gameActions.requestRole({ userID: selfId }));
  }, [selfId, dispatch]);

  useEffect(() => {
    dispatch(gameActions.requestPartners({ selfRole }));
  }, [selfRole, dispatch]);

  const isRoomMaster = useCallback(() => {
    return users && users.length > 0 && selfId === users[0].userID;
  }, [selfId, users]);

  const handleTurnStart = () => {
    dispatch(gameActions.sendTurnStart());
    dispatch(gameActions.requestRolePlaying());
  };

  const handleDone = useCallback(() => {
    const text = `Les ${translatedRoles[rolePlaying]} vous pouvez fermer les yeux.`;
    textToSpeech(text);
    dispatch(gameActions.requestRolePlaying());
  }, [rolePlaying, dispatch]);

  return (
    <div className="game">
      <h1>Joueurs</h1>
      {<List items={users.map((u) => u.userName)}></List>}
      {selfRole && <p>Tu es un {translatedRoles[selfRole]}</p>}
      {selfUser && selfUser.boundTo !== '' && (
        <p>Tu es lié à {selfUser.boundTo}</p>
      )}
      {winner ? (
        <>
          <p>Les {translatedRoles[winner]} ont gagné la partie</p>
          <button onClick={() => navigate('/room')}>
            Recommencer une partie
          </button>
        </>
      ) : null}
      {isRoomMaster() && !isDuringTurn && !winner ? (
        <button onClick={handleTurnStart}>Start Turn</button>
      ) : null}
      {isDuringTurn && selfRole === rolePlaying && <p>A toi de jouer</p>}
      {isDuringTurn && selfRole === rolePlaying ? (
        rolePlaying === 'werewolf' ? (
          <WerewolfActionList
            items={users
              .filter(
                (user) =>
                  user.userID !== selfId &&
                  user.isAlive &&
                  !partners.includes(user.userID)
              )
              .map((u) => u.userName)}
            handleDone={handleDone}
          ></WerewolfActionList>
        ) : selfRole === rolePlaying && rolePlaying === 'cupidon' ? (
          <CupidonActionList
            items={users.map((user) => user.userName)}
            handleDone={handleDone}
          ></CupidonActionList>
        ) : selfRole === rolePlaying && rolePlaying === 'sorcerer' ? (
          <SorcererActionList
            players={users.map((user) => user.userName)}
            actions={['kill', 'save', 'pass']}
            handleDone={handleDone}
          ></SorcererActionList>
        ) : null
      ) : null}
    </div>
  );
}

export default Game;
