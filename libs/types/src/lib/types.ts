export interface User {
  userID: string
  userName: string
}

export type Role = "werewolf" | "villager" | "sorcerer" | "cupidon"

export interface Player {
  userID: string
  userName: string
  role: Role
  alive: boolean
}


export interface GameConfig {
  werewolf: number
  villager: number
  sorcerer: number
  cupidon: number
}