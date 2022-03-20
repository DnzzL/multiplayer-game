// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Game from "./pages/game/game";
import Login from "./pages/login/login";
import Room from "./pages/room/room";
import { gameActions } from "./store/game.slice";


export function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(gameActions.startConnecting())
    dispatch(gameActions.connectionEstablished())
  }, [dispatch])

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
