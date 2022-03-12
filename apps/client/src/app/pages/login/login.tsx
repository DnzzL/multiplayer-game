import { useCallback, useState } from "react";
import {
  useNavigate
} from "react-router-dom";
import socket from "../../socket";
import useStore from "../../store";


export function Login() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("")

  const onClick = useCallback(() => {
    if (userName !== "") {
      socket.auth = { userName: userName };
      socket.connect();
      useStore.setState({ user: {userID: socket.id, userName: userName} })
      navigate("/room")
    }
  }, [userName, navigate])

  return (
    <div className="app">
      <input type="text" name="name" value={userName} onChange={(event) => setUsername(event.target.value)} />
      <input type="submit" name="name" onClick={onClick} />
    </div>
  );
}

export default Login;
