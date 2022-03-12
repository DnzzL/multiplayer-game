// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route } from "react-router-dom";
import Login from "./login/login";
import Room from "./room/room";


export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="room" element={<Room />} />
      </Routes>
    </div>
  )
}

export default App;
