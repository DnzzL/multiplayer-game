export interface User {
  userID: string
  userName: string
}

export type Role = "werewolf" | "villager" | "sorcerer" | "cupidon"

export interface Player extends User {
  role: Role
  alive: boolean
}


export interface GameConfig {
  werewolf: number
  villager: number
  sorcerer: number
  cupidon: number
}