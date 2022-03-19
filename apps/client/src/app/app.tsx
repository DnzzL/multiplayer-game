// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import Game from "./pages/game/game";
import Login from "./pages/login/login";
import Room from "./pages/room/room";
import useStore from "./store";


export function App() {
  useEffect(() => {
    const URL = "http://localhost:3000";
    const socket = io(URL, { transports: ['websocket'], autoConnect: false })
    useStore.setState({socket})
    return () => {
      socket.close();
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="room" element={<Room />} />
        <Route path="game" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App;
