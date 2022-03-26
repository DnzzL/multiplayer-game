import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions, selectSelfRole } from "../../store/game.slice";


export function Game() {
  const dispatch = useDispatch()
  const selfRole = useSelector(selectSelfRole)

  useEffect(() => {
    dispatch(gameActions.requestRole())
  }, [dispatch])

  return (
    <div className="game">
      {selfRole && <p>You are a {selfRole}</p>}
    </div>
  );
}

export default Game;
