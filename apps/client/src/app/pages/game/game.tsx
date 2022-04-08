import { translatedRoles } from '@loup-garou/types';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CupidonActionList from '../../components/cupidon-action-list/cupidon-action-list';
import List from '../../components/list/list';
import SorcererActionList from '../../components/sorcerer-action-list/sorcerer-action-list';
import KillerActionList from '../../components/killer-action-list/killer-action-list';
import {
  gameActions,
  selectIsDuringNightTurn,
  selectIsGameStarted,
  selectPartners,
  selectRolePlaying,
  selectRoomMaster,
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
  const isGameStarted = useSelector(selectIsGameStarted);
  const selfRole = useSelector(selectSelfRole);
  const roomMaster = useSelector(selectRoomMaster);
  const selfId = useSelector(selectSelfId);
  const users = useSelector(selectUsers);
  const selfUser = useSelector(selectSelfUser);
  const isDuringNightTurn = useSelector(selectIsDuringNightTurn);
  const isDuringDayTurn = useSelector(selectIsDuringNightTurn);
  const rolePlaying = useSelector(selectRolePlaying);
  const partners = useSelector(selectPartners);
  const winner = useSelector(selectWinner);

  useEffect(() => {
    dispatch(gameActions.requestRoomMaster());
    dispatch(gameActions.requestRole({ userID: selfId }));
  }, [selfId, dispatch]);

  useEffect(() => {
    dispatch(gameActions.requestPartners({ selfRole }));
  }, [selfRole, dispatch]);

  useEffect(() => {
    if (!isGameStarted) {
      navigate('/room');
    }
  }, [isGameStarted, navigate]);

  const handleTurnStart = () => {
    dispatch(gameActions.sendNightTurnStart());
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
          <button onClick={() => dispatch(gameActions.sendGameEnd())}>
            Recommencer une partie
          </button>
        </>
      ) : null}
      {roomMaster === selfId &&
      !isDuringNightTurn &&
      !isDuringDayTurn &&
      !winner ? (
        <button onClick={handleTurnStart}>Start Turn</button>
      ) : null}
      {isDuringNightTurn && selfRole === rolePlaying && selfUser?.isAlive && (
        <p>A toi de jouer</p>
      )}
      {!isDuringNightTurn && isDuringDayTurn && selfRole === rolePlaying ? (
        <KillerActionList
          items={users
            .filter((user) => user.userID !== selfId && user.isAlive)
            .map((u) => u.userName)}
          handleDone={handleDone}
        ></KillerActionList>
      ) : null}
      {isDuringNightTurn && selfRole === rolePlaying ? (
        rolePlaying === 'werewolf' ? (
          <KillerActionList
            items={users
              .filter(
                (user) =>
                  user.userID !== selfId &&
                  user.isAlive &&
                  !partners.includes(user.userID)
              )
              .map((u) => u.userName)}
            handleDone={handleDone}
          ></KillerActionList>
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
