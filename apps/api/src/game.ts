import { GameConfig, Player, Role, User } from "@loup-garou/types";

const users = new Array<User>();
const players = new Array<Player>();

class Connection {
    socket: any;
    io: any;
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;

        io.on("connection", (socket) => this.userJoined(socket));
        socket.on('getUsers', () => this.getUsers());
        socket.on('gameConfig', (value) => this.handleGameConfig(value));
        // socket.on('disconnect', () => this.disconnect());
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }

    sendUser(user: User) {
        this.io.sockets.emit('user', user);
    }

    addUser(user: User) {
        users.push(user)
    }

    userJoined(socket) {
        const userName = socket.handshake.auth.userName
        console.log("%s has connected", userName)
        const user = {
            userID: socket.id,
            userName
        }
        socket.broadcast.emit("user connected", user);
        this.addUser(user)
    }

    getUsers() {
        users.forEach((user) => this.sendUser(user));
    }

    handleGameConfig(value) {
        const gameConfig = value as GameConfig
        const shuffled = Object.keys(gameConfig)
            .filter((k) => Object(gameConfig)[k] > 0)
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
            .map(({ value }) => value)
        users.forEach((user, idx) => {
            players.push({ ...user, role: shuffled[idx] as Role, alive: true })
        })
    }


    // disconnect() {
    //     users.delete(this.socket);
    // }
}

export function game(io) {
    io.on('connection', (socket) => {
        new Connection(io, socket);
    });
};
