import { GameConfig, GameEvent, Player, Role, User } from "@loup-garou/types";
import { Server } from "socket.io";
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
function addUser(user: User) {
  users.push(user)
}

function userJoined(socket, userName) {
  console.log("%s has connected", userName)
  const user = {
    userID: socket.id,
    userName
  }
  socket.broadcast.emit("user connected", user);
  addUser(user)
}

function handleGameConfig(config) {
  const gameConfig = config as GameConfig
  const shuffled = Object.keys(gameConfig)
    .filter((k) => Object(gameConfig)[k] > 0)
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
    .map(({ value }) => value)
  users.forEach((user, idx) => {
    players.push({ ...user, role: shuffled[idx] as Role, alive: true })
  })
  console.log(players)
}

io.on('connection', (socket) => {
  socket.on(GameEvent.SendUser, (userName: string) => userJoined(socket, userName));
  socket.on(GameEvent.RequestAllUsers, () => {
    io.sockets.emit(GameEvent.SendAllUsers, users)
  });
  socket.on('gameConfig', (config) => handleGameConfig(config));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

