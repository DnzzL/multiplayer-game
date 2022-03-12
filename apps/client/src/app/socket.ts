import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { transports: ['websocket'], autoConnect: false })

socket.onAny((event, ...args) => {
    console.log(event, args);
});


export default socket;