import {
  firstRoleOrder,
  GameConfig,
  GameEvent,
  Player,
  Role,
  roleOrder,
  User,
} from '@loup-garou/types';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import express = require('express');
import http = require('http');
import cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// game(io) -> is giving weird behaviors
const users = new Array<User>();
const players = new Array<Player>();
let gameConfig: GameConfig;
let turnCount = 0;
let currentTurnOrder = 0;

function handleUser(socket, userName) {
  console.log('%s has connected', userName);
  const user = {
    isAlive: true,
    userID: socket.id,
    userName,
  };
  users.push(user);
}

function handleGameConfig(config: GameConfig) {
  if (!config) {
    return;
  }
  gameConfig = config;
  const shuffled = Object.entries(gameConfig)
    .filter(([key, value]) => value != 0)
    .map(([key, value]) => Array(parseInt(value)).fill(key))
    .flat()
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  assignRoles(shuffled);
}

function assignRoles(shuffled) {
  users.forEach((user, idx) => {
    players.push({ ...user, role: shuffled[idx] as Role });
  });
}

function handleGameStart(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
) {
  if (!gameConfig) {
    return;
  }
  io.sockets.emit(GameEvent.ReceiveGameStart);
}

function handleRoleRequest(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
  userID: string
) {
  const role = players.find((player) => player.userID === userID).role;
  socket.emit(GameEvent.ReceiveRole, role);
}

function handleTurnStart() {
  currentTurnOrder = 0;
  turnCount++;
  console.log('starting turn', turnCount);
  io.sockets.emit(GameEvent.ReceiveTurnStart);
}

function handleSendRolePlaying(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
) {
  const assignedRoles = Object.keys(gameConfig).filter(
    (k) => Object(gameConfig)[k] > 0
  );
  if (currentTurnOrder <= assignRoles.length) {
    const rolePlaying =
      turnCount === 1
        ? firstRoleOrder.filter((role) => assignedRoles.includes(role))[
            currentTurnOrder
          ]
        : roleOrder.filter((role) => assignedRoles.includes(role))[
            currentTurnOrder
          ];
    io.sockets.emit(GameEvent.ReceiveRolePlaying, rolePlaying);
    currentTurnOrder = currentTurnOrder + 1;
  } else {
    currentTurnOrder = 0;
    io.sockets.emit(GameEvent.ReceiveTurnEnd);
  }
}

function handlePartnerRequest(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  role: Role
): void {
  role === 'werewolf'
    ? socket.emit(
        GameEvent.ReceivePartners,
        players
          .filter(
            (player) => player.role === role && player.userID !== socket.id
          )
          .map((player) => player.userID)
      )
    : null;
}

io.on('connection', (socket) => {
  socket.on(GameEvent.SendUser, (userName: string) =>
    handleUser(socket, userName)
  );
  socket.on(GameEvent.RequestAllUsers, () => {
    io.sockets.emit(GameEvent.ReceiveAllUsers, users);
  });
  socket.on(GameEvent.SendGameConfig, (config: GameConfig) =>
    handleGameConfig(config)
  );
  socket.on(GameEvent.SendGameStart, () => handleGameStart(io));
  socket.on(GameEvent.RequestRole, (userID: string) =>
    handleRoleRequest(socket, userID)
  );
  socket.on(GameEvent.RequestPartners, (role: Role) =>
    handlePartnerRequest(socket, role)
  );
  socket.on(GameEvent.SendTurnStart, () => handleTurnStart());
  socket.on(GameEvent.RequestRolePlaying, () => handleSendRolePlaying(io));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
