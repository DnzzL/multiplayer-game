
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
                console.log("connected")
                store.dispatch(gameActions.connectionEstablished());
                socket.emit(GameEvent.RequestAllUsers);
            })

            socket.on(GameEvent.SendAllUsers, (users: User[]) => {
                console.log("user joined")
                store.dispatch(gameActions.receiveAllUsers({ users }));
            })

            socket.on(GameEvent.ReceiveUser, (user: User) => {
                store.dispatch(gameActions.receiveUser({ user }));
            })
        }

        if (gameActions.sendUser.match(action) && isConnectionEstablished) {
            socket.emit(GameEvent.SendUser, action.payload.userName);
        }

        next(action);
    }
}

export default gameMiddleware;