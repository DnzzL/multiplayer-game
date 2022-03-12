// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Route, Routes } from "react-router-dom";
import Game from "./pages/game/game";
import Login from "./pages/login/login";
import Room from "./pages/room/room";


export function App() {
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
