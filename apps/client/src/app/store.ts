import create from 'zustand';
import { Player } from './types';

interface GameState {
    user: Player;
    players: Player[];
    turns: number;
    gameConfig: any
    werewolfCount: number;
    villagerCount: number;
}

const useStore = create<GameState>(set => ({
    user: { userID: "", userName: "" },
    players: [],
    werewolfCount: 0,
    villagerCount: 0,
    gameConfig: { werewolves: 0, villagers: 0 },
    turns: 0,
}))

export default useStore
export const useUser = () => useStore((state) => state.user)
export const usePlayers = () => useStore((state) => state.players)
export const useGameConfig = () => useStore((state) => state.gameConfig)
