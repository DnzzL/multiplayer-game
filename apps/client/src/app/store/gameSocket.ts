import { io, Socket } from "socket.io-client";

export class GameSocket {
    private static socket: Socket;

    public static getInstance(): Socket {
        if (!GameSocket.socket) {
            GameSocket.socket = io("http://localhost:3000", { transports: ["websocket"] });
        }
        return GameSocket.socket;
    }
}