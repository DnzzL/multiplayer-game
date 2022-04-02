import { GameEvent, Role, translatedRoles, User } from '@loup-garou/types';
import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';
import { textToSpeech } from '../utils';
import { gameActions } from './game.slice';

const gameMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    const isConnectionEstablished = socket && store.getState().game.isConnected;

    if (gameActions.startConnecting.match(action)) {
      socket = io('http://localhost:3000', { transports: ['websocket'] });

      socket.on('connect', () => {
        store.dispatch(gameActions.connectionEstablished());
        socket.emit(GameEvent.RequestAllUsers);
      });

      socket.on(GameEvent.ReceiveAllUsers, (users: User[]) => {
        store.dispatch(gameActions.receiveAllUsers({ users }));
      });

      socket.on(GameEvent.ReceiveGameStart, () => {
        store.dispatch(gameActions.receiveGameStart());
      });

      socket.on(GameEvent.ReceiveRole, (selfRole: Role) => {
        store.dispatch(gameActions.receiveRole({ selfRole }));
      });

      socket.on(GameEvent.ReceivePartners, (partners: string[]) => {
        store.dispatch(gameActions.receivePartners({ partners }));
      });

      socket.on(GameEvent.ReceiveTurnStart, () => {
        textToSpeech('La nuit tombe sur le village ... Fermez vos yeux');
        store.dispatch(gameActions.switchIsDuringTurn());
        store.dispatch(gameActions.incrementTurnCount());
      });

      socket.on(GameEvent.ReceiveRolePlaying, (rolePlaying: Role) => {
        store.dispatch(gameActions.receiveRolePlaying({ rolePlaying }));
        textToSpeech(`Les ${translatedRoles[rolePlaying]} à vous de jouer`);
      });

      socket.on(GameEvent.ReceiveTurnEnd, () => {
        store.dispatch(gameActions.switchIsDuringTurn());
      });

      socket.on(GameEvent.ReceivePlayerBound, (userNames: string[]) => {
        const [userNameA, userNameB] = userNames;
        store.dispatch(gameActions.bindPlayers({ userNameA, userNameB }));
      });

      socket.on(GameEvent.ReceivePlayerKilled, (userName: string) => {
        store.dispatch(gameActions.receivePlayerKilled({ userName }));
      });

      socket.on(GameEvent.ReceivePlayerRevived, (userName: string) => {
        store.dispatch(gameActions.receivePlayerRevived({ userName }));
      });

      socket.on(GameEvent.ReceiveGameEnd, (winner: Role) => {
        store.dispatch(gameActions.receiveGameEnd({ winner }));
      });
    }

    if (isConnectionEstablished) {
      if (gameActions.sendUser.match(action)) {
        store.dispatch(gameActions.setSelfId({ selfId: socket.id }));
        socket.emit(GameEvent.SendUser, action.payload.userName);
      }
      if (gameActions.requestAllUsers.match(action)) {
        socket.emit(GameEvent.RequestAllUsers);
      }
      if (gameActions.sendGameConfig.match(action)) {
        socket.emit(GameEvent.SendGameConfig, action.payload.gameConfig);
      }
      if (gameActions.sendGameStart.match(action)) {
        socket.emit(GameEvent.SendGameStart);
      }
      if (gameActions.requestRole.match(action)) {
        socket.emit(GameEvent.RequestRole, action.payload.userID);
      }
      if (gameActions.requestPartners.match(action)) {
        socket.emit(GameEvent.RequestPartners, action.payload.selfRole);
      }
      if (gameActions.sendTurnStart.match(action)) {
        socket.emit(GameEvent.SendTurnStart);
      }
      if (gameActions.requestRolePlaying.match(action)) {
        socket.emit(GameEvent.RequestRolePlaying);
      }
      if (gameActions.sendPlayerBound.match(action)) {
        socket.emit(GameEvent.SendPlayerBound, {
          userNameA: action.payload.userNameA,
          userNameB: action.payload.userNameB,
        });
      }
      if (gameActions.sendPlayerKilled.match(action)) {
        socket.emit(GameEvent.SendPlayerKilled, action.payload.userName);
      }
      if (gameActions.sendPlayerRevived.match(action)) {
        socket.emit(GameEvent.SendPlayerRevived, action.payload.userName);
      }
    }

    next(action);
  };
};

export default gameMiddleware;
