
import { GameEvent, User } from '@loup-garou/types';
import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';
import { gameActions } from './game.slice';


const gameMiddleware: Middleware = store => {
    let socket: Socket;

    return next => action => {
        const isConnectionEstablished = socket && store.getState().game.isConnected;

        if (gameActions.startConnecting.match(action)) {
            socket = io("http://localhost:3000", { transports: ["websocket"] });

            socket.on('connect', () => {
                store.dispatch(gameActions.connectionEstablished());
                socket.emit(GameEvent.RequestAllUsers);
            })

            socket.on(GameEvent.SendAllUsers, (users: User[]) => {
                store.dispatch(gameActions.receiveAllUsers({ users }));
            })

        }

        if (isConnectionEstablished) {
            if (gameActions.sendUser.match(action)) {
                socket.emit(GameEvent.SendUser, action.payload.userName);
            }
            if (gameActions.getAllUsers.match(action)) {
                socket.emit(GameEvent.RequestAllUsers);
            }
            if (gameActions.setGameConfig.match(action)) {
                socket.emit(GameEvent.SendGameConfig, action.payload.gameConfig)
            }
        }

        next(action);
    }
}

export default gameMiddleware;