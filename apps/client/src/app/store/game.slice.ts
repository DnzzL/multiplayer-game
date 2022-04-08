import { GameConfig, Role, User } from '@loup-garou/types';
import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

export const GAME_FEATURE_KEY = 'game';

/*
 * Update these interfaces according to your requirements.
 */
export interface GameEntity {
  id: number;
}

export interface GameState extends EntityState<GameEntity> {
  selfId: string;
  isEstablishingConnection: boolean;
  isConnected: boolean;
  users: User[];
  roomMaster: string;
  gameConfig: GameConfig;
  selfRole: Role;
  partners: string[];
  isGameStarted: boolean;
  isDuringNightTurn: boolean;
  isDuringDayTurn: boolean;
  turnCount: number;
  rolePlaying: Role;
  winner: Role | null;
}

export const gameAdapter = createEntityAdapter<GameEntity>();

export const initialGameState: GameState = gameAdapter.getInitialState({
  selfId: '',
  isEstablishingConnection: false,
  isConnected: false,
  users: [],
  roomMaster: 'none',
  gameConfig: { werewolf: 0, villager: 0, cupidon: 0, sorcerer: 0 },
  selfRole: 'villager',
  partners: [],
  isGameStarted: false,
  isDuringNightTurn: false,
  isDuringDayTurn: false,
  turnCount: 0,
  rolePlaying: 'cupidon',
  winner: null,
});

export const gameSlice = createSlice({
  name: GAME_FEATURE_KEY,
  initialState: initialGameState,
  reducers: {
    startConnecting: (state) => {
      return {
        ...state,
        isEstablishingConnection: true,
      };
    },
    connectionEstablished: (state) => {
      return {
        ...state,
        isConnected: true,
        isEstablishingConnection: true,
      };
    },
    setSelfId: (state, action) => {
      return {
        ...state,
        selfId: action.payload.selfId,
      };
    },
    sendUser: (state, action: PayloadAction<{ userName: string }>) => {
      return;
    },
    requestRoomMaster: () => {
      return;
    },
    receiveRoomMaster: (
      state,
      action: PayloadAction<{
        roomMaster: string;
      }>
    ) => {
      return {
        ...state,
        roomMaster: action.payload.roomMaster,
      };
    },
    requestAllUsers: () => {
      return;
    },
    receiveAllUsers: (
      state,
      action: PayloadAction<{
        users: User[];
      }>
    ) => {
      return {
        ...state,
        users: action.payload.users,
      };
    },
    sendGameConfig: (
      state,
      action: PayloadAction<{ gameConfig: GameConfig }>
    ) => {
      return;
    },
    setGameConfig: (
      state,
      action: PayloadAction<{
        gameConfig: GameConfig;
      }>
    ) => {
      return {
        ...state,
        gameConfig: action.payload.gameConfig,
      };
    },
    sendGameStart: () => {
      return;
    },
    requestRole: (state, action: PayloadAction<{ userID: string }>) => {
      return;
    },
    receiveRole: (
      state,
      action: PayloadAction<{
        selfRole: Role;
      }>
    ) => {
      return {
        ...state,
        selfRole: action.payload.selfRole,
      };
    },
    requestPartners: (state, action: PayloadAction<{ selfRole: Role }>) => {
      return;
    },
    receivePartners: (
      state,
      action: PayloadAction<{
        partners: string[];
      }>
    ) => {
      return {
        ...state,
        partners: [...action.payload.partners],
      };
    },
    receiveGameStart: (state) => {
      return {
        ...state,
        isGameStarted: true,
      };
    },
    switchIsDuringTurn: (state) => {
      return {
        ...state,
        isDuringNightTurn: !state.isDuringNightTurn,
      };
    },
    sendNightTurnStart: () => {
      return;
    },
    receiveDayTurnStart: (state) => {
      return {
        ...state,
        isDuringDayTurn: true,
        isDuringNightTurn: false,
      };
    },
    incrementTurnCount: (state) => {
      return {
        ...state,
        turnCount: state.turnCount + 1,
      };
    },
    requestRolePlaying: () => {
      return;
    },
    receiveRolePlaying: (
      state,
      action: PayloadAction<{ rolePlaying: Role }>
    ) => {
      return {
        ...state,
        rolePlaying: action.payload.rolePlaying,
      };
    },
    sendPlayerBound: (
      state,
      action: PayloadAction<{ userNameA: string; userNameB: string }>
    ) => {
      return;
    },
    bindPlayers: (
      state,
      action: PayloadAction<{ userNameA: string; userNameB: string }>
    ) => {
      console.log(action.payload);
      const userA = state.users.find(
        (user) => user.userName === action.payload.userNameA
      );
      const indexA = state.users.findIndex(
        (user) => user.userName === action.payload.userNameA
      );
      const userB = state.users.find(
        (user) => user.userName === action.payload.userNameB
      );
      const indexB = state.users.findIndex(
        (user) => user.userName === action.payload.userNameB
      );
      return userA && userB
        ? indexA < indexB
          ? {
              ...state,
              users: [
                ...state.users.slice(0, indexA),
                { ...userA, boundTo: userB.userName },
                ...state.users.slice(indexA + 1, indexB),
                { ...userB, boundTo: userA.userName },
                ...state.users.slice(indexB + 1),
              ],
            }
          : {
              ...state,
              users: [
                ...state.users.slice(0, indexB),
                { ...userB, boundTo: userA.userName },
                ...state.users.slice(indexB + 1, indexA),
                { ...userA, boundTo: userB.userName },
                ...state.users.slice(indexA + 1),
              ],
            }
        : state;
    },
    sendPlayerKilled: (state, action: PayloadAction<{ userName: string }>) => {
      return;
    },
    receivePlayerKilled: (
      state,
      action: PayloadAction<{ userName: string }>
    ) => {
      const user = state.users.find(
        (user) => user.userName === action.payload.userName
      );
      const index = state.users.findIndex(
        (user) => user.userName === action.payload.userName
      );
      return user
        ? {
            ...state,
            users: [
              ...state.users.slice(0, index),
              { ...user, isAlive: false },
              ...state.users.slice(index + 1),
            ],
          }
        : state;
    },
    sendPlayerRevived: (state, action: PayloadAction<{ userName: string }>) => {
      return;
    },
    receivePlayerRevived: (
      state,
      action: PayloadAction<{ userName: string }>
    ) => {
      const user = state.users.find(
        (user) => user.userName === action.payload.userName
      );
      const index = state.users.findIndex(
        (user) => user.userName === action.payload.userName
      );
      return user
        ? {
            ...state,
            users: [
              ...state.users.slice(0, index),
              { ...user, isAlive: true },
              ...state.users.slice(index + 1),
            ],
          }
        : state;
    },
    receiveGameOver: (state, action: PayloadAction<{ winner: Role }>) => {
      return {
        ...state,
        isDuringTurn: false,
        winner: action.payload.winner,
      };
    },
    sendGameEnd: () => {
      return;
    },
    receiveGameEnd: (state) => {
      return {
        ...state,
        isGameStarted: false,
      };
    },
  },
});

/*
 * Export reducer for store configuration.
 */
export const gameReducer = gameSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(gameActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const gameActions = gameSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllGame);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
export const getGameState = (rootState: any): GameState =>
  rootState[GAME_FEATURE_KEY];

export const selectSelfId = createSelector(
  getGameState,
  (state) => state.selfId
);
export const selectRoomMaster = createSelector(
  getGameState,
  (state) => state.roomMaster
);
export const selectUsers = createSelector(getGameState, (state) => state.users);
export const selectSelfUser = createSelector(getGameState, (state) =>
  state.users.find((user) => user.userID === state.selfId)
);
export const selectGameConfig = createSelector(
  getGameState,
  (state) => state.gameConfig
);
export const selectIsGameStarted = createSelector(
  getGameState,
  (state) => state.isGameStarted
);
export const selectSelfRole = createSelector(
  getGameState,
  (state) => state.selfRole
);
export const selectPartners = createSelector(
  getGameState,
  (state) => state.partners
);
export const selectIsDuringNightTurn = createSelector(
  getGameState,
  (state) => state.isDuringNightTurn
);
export const selectIsDuringDayTurn = createSelector(
  getGameState,
  (state) => state.isDuringDayTurn
);
export const selectTurnCount = createSelector(
  getGameState,
  (state) => state.turnCount
);
export const selectRolePlaying = createSelector(
  getGameState,
  (state) => state.rolePlaying
);
export const selectWinner = createSelector(
  getGameState,
  (state) => state.winner
);
