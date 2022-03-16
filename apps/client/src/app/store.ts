import { GameConfig, Player, User } from '@loup-garou/types';
import create from 'zustand';


interface GameState {
    user: User;
    users: User[];
    turns: number;
    gameConfig: GameConfig
    werewolfCount: number;
    villagerCount: number;
    players: Player[]
}

const useStore = create<GameState>(set => ({
    user: { userID: "", userName: "" },
    users: [],
    werewolfCount: 0,
    villagerCount: 0,
    gameConfig: { werewolf: 0, villager: 0, sorcerer: 0, cupidon: 0 },
    turns: 0,
    players: []
}))

export default useStore
export const useUser = () => useStore((state) => state.user)
export const useUsers = () => useStore((state) => state.users)
export const useGameConfig = () => useStore((state) => state.gameConfig)
export const useTurns = () => useStore((state) => state.turns)
export const usePlayers = () => useStore((state) => state.players)
