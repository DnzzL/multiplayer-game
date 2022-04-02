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
let players = new Array<Player>();
let gameConfig: GameConfig;
let turnCount = 0;
let currentTurnOrder = 0;
let currentTurnKilled = [];
let currentTurnRevived = [];

function handleUser(socket, userName) {
  console.log('%s has connected', userName);
  const user = {
    isAlive: true,
    boundTo: '',
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
  const role = players.find((player) => player.userID === userID)?.role;
  socket.emit(GameEvent.ReceiveRole, role);
}

function handleTurnStart() {
  currentTurnOrder = 0;
  turnCount++;
  console.log('starting turn', turnCount);
  io.sockets.emit(GameEvent.ReceiveTurnStart);
}

function endTurn() {
  const killCounts = {};
  for (const num of currentTurnKilled) {
    killCounts[num] = killCounts[num] ? killCounts[num] + 1 : 1;
  }
  const reviveCounts = {};
  for (const num of currentTurnRevived) {
    reviveCounts[num] = reviveCounts[num] ? reviveCounts[num] + 1 : 1;
  }
  currentTurnKilled
    .filter(
      (userName) =>
        !currentTurnRevived.includes(userName) ||
        reviveCounts[userName] < killCounts[userName]
    )
    .forEach((userName) => {
      io.sockets.emit(GameEvent.ReceivePlayerKilled, userName);
    });
  if (!werewolfAlive()) {
    io.sockets.emit(GameEvent.ReceiveGameEnd, 'villager');
  } else if (!villagerAlive()) {
    io.sockets.emit(GameEvent.ReceiveGameEnd, 'werewolf');
  } else {
    currentTurnOrder = 0;
    currentTurnKilled = [];
    currentTurnRevived = [];
    io.sockets.emit(GameEvent.ReceiveTurnEnd);
  }
}

function handleSendRolePlaying(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
) {
  const assignedPlayingRoles = Object.keys(gameConfig).filter(
    (k) => k !== 'villager' && Object(gameConfig)[k] > 0
  );
  if (currentTurnOrder <= assignedPlayingRoles.length - 1) {
    const rolePlaying =
      turnCount === 1
        ? firstRoleOrder.filter((role) => assignedPlayingRoles.includes(role))[
            currentTurnOrder
          ]
        : roleOrder.filter((role) => assignedPlayingRoles.includes(role))[
            currentTurnOrder
          ];
    io.sockets.emit(GameEvent.ReceiveRolePlaying, rolePlaying);
    currentTurnOrder = currentTurnOrder + 1;
  } else {
    endTurn();
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

function handlePlayerBound(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  userNameA: string,
  userNameB: string
): void {
  if (userNameA === '' || userNameB === '') {
    return;
  }
  for (const userName of [userNameA, userNameB]) {
    io.sockets
      .to(users.find((user) => user.userName === userName).userID)
      .emit(GameEvent.ReceivePlayerBound, [userNameA, userNameB]);
  }
}

function handlePlayerKilled(userName: string): void {
  currentTurnKilled.push(userName);
  const player = players.find((player) => player.userName === userName);
  const index = players.findIndex((player) => player.userName === userName);
  players = players
    ? [
        ...players.slice(0, index),
        { ...player, isAlive: false },
        ...players.slice(index + 1),
      ]
    : players;
}

function handlePlayerRevived(userName: string): void {
  currentTurnRevived.push(userName);
  const player = players.find((player) => player.userName === userName);
  const index = players.findIndex((player) => player.userName === userName);
  players = players
    ? [
        ...players.slice(0, index),
        { ...player, isAlive: true },
        ...players.slice(index + 1),
      ]
    : players;
}

function werewolfAlive(): boolean {
  return (
    players.filter((player) => player.role === 'werewolf' && player.isAlive)
      .length > 0
  );
}

function villagerAlive(): boolean {
  return (
    players.filter((player) => player.role === 'villager' && player.isAlive)
      .length > 0
  );
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
  socket.on(GameEvent.SendPlayerBound, ({ userNameA, userNameB }) =>
    handlePlayerBound(io, userNameA, userNameB)
  );
  socket.on(GameEvent.SendPlayerKilled, (userName: string) =>
    handlePlayerKilled(userName)
  );
  socket.on(GameEvent.SendPlayerRevived, (userName: string) =>
    handlePlayerRevived(userName)
  );
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
