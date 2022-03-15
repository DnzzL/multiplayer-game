
export interface User {
    userID: string
    userName: string
}

export type Role = "werewolf" | "villager" | "sorcerer" | "cupidon"
export interface Player extends User {
    role: Role
}