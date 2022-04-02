import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import List from '../../components/list/list';
import RoleForm from '../../components/roleform/roleform';
import {
  gameActions,
  selectIsGameStarted,
  selectRoomMaster,
  selectSelfId,
  selectUsers,
} from '../../store/game.slice';

export function Room() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selfId = useSelector(selectSelfId);
  const roomMaster = useSelector(selectRoomMaster);
  const users = useSelector(selectUsers);
  const isGameStarted = useSelector(selectIsGameStarted);

  useEffect(() => {
    dispatch(gameActions.requestAllUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(gameActions.requestRoomMaster());
  }, [users, dispatch]);

  useEffect(() => {
    if (isGameStarted) {
      navigate('/game');
    }
  }, [isGameStarted, navigate]);

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
      {roomMaster === selfId ? (
        <RoleForm userCount={users.length}></RoleForm>
      ) : (
        <WaitingConfiguration></WaitingConfiguration>
      )}
    </div>
  );
}

export default Room;
