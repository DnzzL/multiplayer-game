import { GameConfig, GameEvent, Player, Role, User } from "@loup-garou/types";
import { Server } from "socket.io";
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
  socket.broadcast.emit(GameEvent.UserJoined, user);
  addUser(user)
}

function handleGameConfig(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, config: GameConfig) {
  if (!config) {
    return
  }
  gameConfig = config
  io.sockets.emit(GameEvent.SetGameConfig, gameConfig)
}

function assignRoles(shuffled) {
  users.forEach((user, idx) => {
    players.push({ ...user, role: shuffled[idx] as Role, alive: true })
  })
}

function handleGameStart() {
  const shuffled = Object.keys(gameConfig)
    .filter((k) => Object(gameConfig)[k] > 0)
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
    .map(({ value }) => value)
}

io.on('connection', (socket) => {
  socket.on(GameEvent.SendUser, (userName: string) => userJoined(socket, userName));
  socket.on(GameEvent.RequestAllUsers, () => {
    io.sockets.emit(GameEvent.SendAllUsers, users)
  });
  socket.on(GameEvent.RequestGameConfig, () => {
    socket.emit(GameEvent.SendGameConfig, gameConfig)
  });
  socket.on(GameEvent.SetGameConfig, (config) => handleGameConfig(io, config));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

