import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import List from '../../components/list/list';
import RoleForm from '../../components/roleform/roleform';
import {
  gameActions,
  selectIsGameStarted,
  selectSelfId,
  selectUsers,
} from '../../store/game.slice';

export function Room() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selfId = useSelector(selectSelfId);
  const users = useSelector(selectUsers);
  const isGameStarted = useSelector(selectIsGameStarted);

  useEffect(() => {
    dispatch(gameActions.requestAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (isGameStarted) {
      navigate('/game');
    }
  }, [isGameStarted, dispatch, navigate]);

  const isRoomMaster = useCallback(() => {
    return users && users.length > 0 && selfId === users[0].userID;
  }, [selfId, users]);

  const WaitingConfiguration = () => {
    return (
      <p>
        {users && users.length && users[0].userName} is configuring the game
      </p>
    );
  };

  return (
    <div className="room">
      <h1>Joueurs</h1>
      {<List items={users.map((u) => u.userName)}></List>}
      {isRoomMaster() ? (
        <RoleForm userCount={users.length}></RoleForm>
      ) : (
        <WaitingConfiguration></WaitingConfiguration>
      )}
    </div>
  );
}

export default Room;
