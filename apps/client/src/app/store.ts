import create from 'zustand';
import { Player } from './types';

interface GameState {
    user: Player;
    players: Player[];

}

const useStore = create<GameState>(set => ({
    user: { userID: "", userName: "" },
    players: [],
}))

export default useStore
export const useUser = () => useStore((state) => state.user)
export const usePlayers = () => useStore((state) => state.players)
// export const useSetUserName = (userName: string) => useStore((state) => state.setUserName(userName))
// export const useSetPlayers = (players: string[]) => useStore((state) => state.setPlayers(players))