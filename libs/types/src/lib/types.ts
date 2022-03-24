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

export enum GameEvent {
  SendUser = 'send_user',
  UserJoined = 'user_joined',
  RequestAllUsers = 'request_all_users',
  SendAllUsers = 'send_all_users',
  SendGameConfig = 'send_game_config',
  SetGameConfig = 'set_game_config',
}