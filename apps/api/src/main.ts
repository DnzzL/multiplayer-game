import express = require('express');
import http = require('http');
import { Server } from "socket.io";

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
  const players = [];
  for (let [id, socket] of io.of("/").sockets) {
    players.push({
      userID: id,
      userName: socket.data.userName,
    });
  }
  socket.emit("players", players);
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


server.listen(3000, () => {
  console.log('listening on *:3000');
});


// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to api!' });
// });

// const port = process.env.port || 3333;
// const server = app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);