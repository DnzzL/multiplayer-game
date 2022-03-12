import create from 'zustand';
import { Player } from './types';

interface GameState {
    user: Player;
    userName: string;
    players: Player[]
}

const useStore = create<GameState>(set => ({
    user: { id: "", userName: "" },
    userName: "",
    players: [],
}))

export default useStore
// export const useUserName = () => useStore((state) => state.userName)
// export const useCurrentPlayer = () => useStore((state) => state.currentPlayer)
// export const usePlayers = () => useStore((state) => state.players)
// export const useSetUserName = (userName: string) => useStore((state) => state.setUserName(userName))
// export const useSetPlayers = (players: string[]) => useStore((state) => state.setPlayers(players))