import create from 'zustand';

interface GameState {
    userName: string;
    currentPlayer: string;
    players: string[]
    setUserName: (player: string) => void;
    setCurrentPlayer: (player: string) => void;
    setPlayers: (players: string[]) => void;
}

const useStore = create<GameState>(set => ({
    userName: "",
    currentPlayer: "",
    players: [],
    setUserName: (userName: string) => set((state) => ({
        ...state,
        userName
    })),
    setCurrentPlayer: (currentPlayer: string) => set((state) => ({
        ...state,
        currentPlayer
    })),
    setPlayers: (players: string[]) => set((state) => ({
        ...state,
        players
    }))
}))

export default useStore
// export const useUserName = () => useStore((state) => state.userName)
// export const useCurrentPlayer = () => useStore((state) => state.currentPlayer)
// export const usePlayers = () => useStore((state) => state.players)
// export const useSetUserName = (userName: string) => useStore((state) => state.setUserName(userName))
// export const useSetPlayers = (players: string[]) => useStore((state) => state.setPlayers(players))