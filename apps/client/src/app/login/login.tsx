import { useCallback, useEffect, useState } from "react";
import socket from "../socket";
import useStore from "../store";
import { Player } from "../types";
import {
  useNavigate,
} from "react-router-dom";


export function Login() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("")
  const user = useStore((state) => state.user)

  const onClick = useCallback(() => {
    if (userName) {
      socket.auth = { userName: userName };
      socket.connect();
      useStore.setState({ user })
      navigate("/room")
    }
  }, [userName, user, navigate])

  useEffect(() => {
    socket.on("players", (players: Player[]) => {
      useStore.setState({
        players: [...players, user]
      })
    });
  }, [user])

  return (
    <div className="app">
      <input type="text" name="name" value={userName} onChange={(event) => setUsername(event.target.value)} />
      <input type="submit" name="name" onClick={onClick} />
    </div>
  );
}

export default Login;
