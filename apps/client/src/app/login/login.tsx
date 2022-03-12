import React, { useCallback, useEffect } from "react";
import socket from "../socket";
import useStore from "../store";

export function Login() {
  const userName = useStore((state) => state.userName)

  const onClick = useCallback(() => {
    if (userName) {
      socket.auth = { userName: userName };
      socket.connect();
      useStore.setState({ userName: "" })
    }
  }, [userName])

  useEffect(() => {
    socket.on("players", (players: string[]) => {
      useStore.setState({
        players: [...players, userName]
      })
    });
  }, [userName])


  return (
    <div className="app">
      <input type="text" name="name" value={userName} onChange={(event) => useStore.setState({ userName: event.target.value })} />
      <input type="submit" name="name" onClick={onClick} />
    </div>
  );
}

export default Login;
