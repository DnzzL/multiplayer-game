import { GameConfig, GameEvent, Player, Role, User } from "@loup-garou/types";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import express = require('express');
import http = require('http');
import cors = require('cors');

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

// game(io) -> is giving weird behaviors
const users = new Array<User>();
const players = new Array<Player>();
let gameConfig: GameConfig

function addUser(user: User) {
  users.push(user)
}

function userJoined(socket, userName) {
  console.log("%s has connected", userName)
  const user = {
    userID: socket.id,
    userName
  }
  addUser(user)
}

function handleGameConfig(config: GameConfig) {
  if (!config) {
    return
  }
  gameConfig = config
}

function assignRoles(shuffled) {
  users.forEach((user, idx) => {
    players.push({ ...user, role: shuffled[idx] as Role, alive: true })
  })
}

function handleGameStart(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
  if (!gameConfig) {
    return
  }
  const shuffled = Object.keys(gameConfig)
    .filter((k) => Object(gameConfig)[k] > 0)
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
    .map(({ value }) => value)
  assignRoles(shuffled)
  players.forEach((player) => {
    socket.emit(GameEvent.ReceiveRole, player.role)
  })
}

io.on('connection', (socket) => {
  socket.on(GameEvent.SendUser, (userName: string) => userJoined(socket, userName));
  socket.on(GameEvent.RequestAllUsers, () => {
    io.sockets.emit(GameEvent.ReceiveAllUsers, users)
  });
  socket.on(GameEvent.SendGameConfig, (config: GameConfig) => handleGameConfig(config));
  socket.on(GameEvent.SendGameStart, () => handleGameStart(socket));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

