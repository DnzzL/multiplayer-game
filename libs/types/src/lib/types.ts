export interface User {
  userID: string;
  userName: string;
  isAlive: boolean;
  boundTo: string;
}

export type Role = 'werewolf' | 'villager' | 'sorcerer' | 'cupidon';
export const translatedRoles = {
  werewolf: 'Loup-garou',
  villager: 'Villageois',
  sorcerer: 'Sorcier',
  cupidon: 'Cupidon',
};

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
  ReceivePlayerDisconnected = 'receive_player_disconnected',
  RequestRoomMaster = 'request_room_master',
  ReceiveRoomMaster = 'receive_room_master',
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
  SendPlayerRevived = 'send_player_revived',
  ReceivePlayerRevived = 'receive_player_revived',
  SendPlayerBound = 'send_player_bound',
  ReceivePlayerBound = 'receive_player_bound',
  ReceiveGameOver = 'receive_game_over',
  SendGameEnd = 'send_game_end',
  ReceiveGameEnd = 'receive_game_end',
}

export const firstRoleOrder: Role[] = ['cupidon', 'werewolf', 'sorcerer'];
export const roleOrder: Role[] = ['werewolf', 'sorcerer'];

export type SorcererAction = 'kill' | 'revive' | 'pass';

export const actions = ['bind', 'kill', 'save', 'pass'];
