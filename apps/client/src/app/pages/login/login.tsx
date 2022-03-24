import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate
} from "react-router-dom";
import { gameActions } from "../../store/game.slice";


export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUsername] = useState("")

  const onClick = useCallback(() => {
    if (userName !== "") {
      dispatch(gameActions.sendUser({userName}))
      navigate("/room")
    }
  }, [userName, dispatch, navigate])

  return (
    <div className="app">
      <input type="text" name="name" value={userName} onChange={(event) => setUsername(event.target.value)} />
      <input type="submit" name="name" onClick={onClick} />
    </div>
  );
}

export default Login;
