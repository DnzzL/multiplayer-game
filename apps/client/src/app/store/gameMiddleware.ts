
import { Action, Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';
import { gameActions } from './game.slice';
interface User {
    userID: string
    userName: string

}
enum GameEvent {
    SendUser = 'send_user',
    RequestAllUsers = 'request_all_users',
    SendAllUsers = 'send_all_users',
    ReceiveUser = 'receive_player'
}


const chatMiddleware: Middleware = store => next => action => {
    let socket: Socket;

    return (next: (arg0: any) => void) => (action: Action) => {
        const isConnectionEstablished = socket && store.getState().chat.isConnected;

        if (gameActions.startConnecting.match(action)) {
            socket = io("http://localhost:3000", { transports: ["websocket"], autoConnect: false });

            socket.on('connect', () => {
                store.dispatch(gameActions.connectionEstablished());
                socket.emit(GameEvent.RequestAllUsers);
            })

            socket.on(GameEvent.SendAllUsers, (users: User[]) => {
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

export default chatMiddleware;