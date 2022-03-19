import { Server } from "socket.io";
import { game } from "./game";
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

game(io)

server.listen(3000, () => {
  console.log('listening on *:3000');
});

