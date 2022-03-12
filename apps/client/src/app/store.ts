import create from 'zustand';
import { Player } from './types';

interface GameState {
    user: Player;
    players: Player[];
    werewolfCount: number;
    turns: number;
    addWerefolf: () => void
}

const useStore = create<GameState>(set => ({
    user: { userID: "", userName: "" },
    players: [],
    werewolfCount: 0,
    turns: 0,
    addWerefolf: () => set(state => ({ werewolfCount: state.werewolfCount + 1 }))
}))

export default useStore
export const useUser = () => useStore((state) => state.user)
export const usePlayers = () => useStore((state) => state.players)
export const useWerewolfCount = () => useStore((state) => state.werewolfCount)
export const useAddWerewolf = () => useStore((state) => state.addWerefolf)