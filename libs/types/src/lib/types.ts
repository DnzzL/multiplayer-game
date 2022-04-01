export interface User {
  userID: string;
  userName: string;
  isAlive: boolean;
  boundTo: string;
}

export type Role = 'werewolf' | 'villager' | 'sorcerer' | 'cupidon';

export interface Player extends User {
  role: Role;
}

export interface GameConfig {
  werewolf: number;
  villager: number;
  sorcerer: number;
  cupidon: number;
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
  RequestPartners = 'request_partners',
  ReceivePartners = 'receive_partners',
  RequestRolePlaying = 'request_role_playing',
  ReceiveRolePlaying = 'receive_role_playing',
  ReceiveTurnEnd = 'receive_turn_end',
  SendPlayerKilled = 'send_player_killed',
  ReceivePlayerKilled = 'receive_player_killed',
  SendPlayerBound = 'send_player_bound',
  ReceivePlayerBound = 'receive_player_bound',
}

export const firstRoleOrder: Role[] = ['cupidon', 'werewolf', 'sorcerer'];
export const roleOrder: Role[] = ['werewolf', 'sorcerer'];
export const characterActions = {
  cupidon: ['bind'],
  werewolf: ['kill'],
  sorcerer: ['kill', 'save', 'pass'],
};

export const actions = ['bind', 'kill', 'save', 'pass'];
