import { GameConfig, Player } from '@loup-garou/types';
import { Server } from "socket.io";
import express = require('express');
import http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on("connection", (socket) => {
  console.log("%s has connected", socket.data.userName)
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      userName: socket.data.userName,
    });
  }
  socket.emit("users", users);
});

io.use((socket, next) => {
  const userName = socket.handshake.auth.userName;
  if (!userName) {
    return next(new Error("invalid username"));
  }
  socket.data.userName = userName;
  next();
});

io.on("connection", (socket) => {
  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    userName: socket.data.userName,
  });
});


io.on("players", (players: Player[]) => {
  console.log(players)
})

io.on("gameconfig", (gameConfig: GameConfig) => {
  console.log(gameConfig)
})


server.listen(3000, () => {
  console.log('listening on *:3000');
});

