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
  RequestAllUsers = 'request_all_users',
  ReceiveAllUsers = 'receive_all_users',
  SendGameConfig = 'send_game_config',
  SendGameStart = 'send_game_start',
  RequestRole = 'request_role',
  ReceiveRole = 'receive_role',
  ReceiveGameStart = 'receive_game_start',
  SendTurnStart = 'send_turn_start',
  ReceiveTurnStart = 'receive_turn_start',
  RequestRolePlaying = 'request_role_playing',
  ReceiveRolePlaying = 'receive_role_playing'
}


export const firstRoleOrder: Role[] = ["cupidon", "werewolf", "sorcerer"]
export const roleOrder: Role[] = ["werewolf", "sorcerer"]