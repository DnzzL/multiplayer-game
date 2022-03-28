import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions, selectIsDuringTurn, selectRolePlaying, selectSelfId, selectSelfRole, selectUsers } from "../../store/game.slice";


export function Game() {
  const dispatch = useDispatch()
  const selfRole = useSelector(selectSelfRole)
  const selfId = useSelector(selectSelfId)
  const users = useSelector(selectUsers)
  const isDuringTurn = useSelector(selectIsDuringTurn)
  const rolePlaying = useSelector(selectRolePlaying)

  useEffect(() => {
    dispatch(gameActions.requestRole({ userID: selfId }))
  }, [selfId, dispatch])

  const textToSpeech = (text: string) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'fr-FR';
    synth.speak(utterThis);
  }

  const isRoomMaster = useCallback(() => {
    return users && users.length > 0 && selfId === users[0].userID
  }, [selfId, users])

  const handleClick = () => {
    const text = "La nuit tombe sur le village ... Fermez vos yeux"
    textToSpeech(text)
    dispatch(gameActions.switchIsDuringTurn())
    dispatch(gameActions.incrementTurnCount())
    dispatch(gameActions.requestRolePlaying())
  }

  const handleDone = useCallback(() => {
    const text = `Les ${rolePlaying} vous pouvez fermer les yeux.`
    textToSpeech(text)
    dispatch(gameActions.requestRolePlaying())
  }, [rolePlaying, dispatch])

  return (
    <div className="game">
      {selfRole && <p>You are a {selfRole}</p>}
      {/* {rolePlaying ?
        selfRole === rolePlaying ?
          <>
            <p>You are playing</p>
            <button onClick={handleDone}>Done</button>
          </> : null
        : isRoomMaster() ? <button onClick={handleClick}>Start Turn</button> : null
      } */}
      {isRoomMaster() ? !isDuringTurn && <button onClick={handleClick}>Start Turn</button> : null}
      {selfRole === rolePlaying && <p>You are playing</p> && <button onClick={handleDone}>Done</button>}
    </div>
  );
}

export default Game;
