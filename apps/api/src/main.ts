import { firstRoleOrder, GameConfig, GameEvent, Player, Role, roleOrder, User } from "@loup-garou/types";
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
let turnCount = 0
let currentTurnOrder = 0

function handleUser(socket, userName) {
  console.log("%s has connected", userName)
  const user = {
    userID: socket.id,
    userName
  }
  users.push(user)
}

function handleGameConfig(config: GameConfig) {
  if (!config) {
    return
  }
  gameConfig = config
  const shuffled = Object.keys(gameConfig)
    .filter((k) => Object(gameConfig)[k] > 0)
    .map((value: string) => ({ value, sort: Math.random() }))
    .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
    .map(({ value }) => value)
  assignRoles(shuffled)
}

function assignRoles(shuffled) {
  users.forEach((user, idx) => {
    players.push({ ...user, role: shuffled[idx] as Role, alive: true })
  })
}

function handleGameStart(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) {
  if (!gameConfig) {
    return
  }
  io.sockets.emit(GameEvent.ReceiveGameStart)
}

function handleRoleRequest(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>, userID: string) {
  const role = players.find(player => player.userID === userID).role
  socket.emit(GameEvent.ReceiveRole, role)
}

function handleTurnStart() {
  currentTurnOrder = 0
  turnCount++
  console.log("starting turn", turnCount)
}

function handleSendRolePlaying(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) {
  const assignedRoles = Object.keys(gameConfig)
    .filter((k) => Object(gameConfig)[k] > 0)
  const rolePlaying = turnCount === 0 ? firstRoleOrder.filter(role => assignedRoles.includes(role))[currentTurnOrder] : roleOrder.filter(role => assignedRoles.includes(role))[currentTurnOrder]
  io.sockets.emit(GameEvent.ReceiveRolePlaying, rolePlaying)
  currentTurnOrder = currentTurnOrder <= assignRoles.length - 1 ? currentTurnOrder + 1 : 0
}

io.on('connection', (socket) => {
  socket.on(GameEvent.SendUser, (userName: string) => handleUser(socket, userName));
  socket.on(GameEvent.RequestAllUsers, () => {
    io.sockets.emit(GameEvent.ReceiveAllUsers, users)
  });
  socket.on(GameEvent.SendGameConfig, (config: GameConfig) => handleGameConfig(config));
  socket.on(GameEvent.SendGameStart, () => handleGameStart(io));
  socket.on(GameEvent.RequestRole, (userID: string) => handleRoleRequest(socket, userID));
  socket.on(GameEvent.SendTurnStart, () => handleTurnStart());
  socket.on(GameEvent.RequestRolePlaying, () => handleSendRolePlaying(io));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

