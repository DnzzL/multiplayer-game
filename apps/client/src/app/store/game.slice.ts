import { GameConfig, Role, User } from '@loup-garou/types';
import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';

export const GAME_FEATURE_KEY = 'game';

/*
 * Update these interfaces according to your requirements.
 */
export interface GameEntity {
  id: number;
}

export interface GameState extends EntityState<GameEntity> {
  selfId: string,
  isEstablishingConnection: boolean;
  isConnected: boolean;
  users: User[],
  gameConfig: GameConfig,
  selfRole: Role,
  isGameStarted: boolean
}

export const gameAdapter = createEntityAdapter<GameEntity>();


export const initialGameState: GameState = gameAdapter.getInitialState({
  selfId: "",
  isEstablishingConnection: false,
  isConnected: false,
  users: [],
  gameConfig: { "werewolf": 0, "villager": 0, "cupidon": 0, "sorcerer": 0 },
  selfRole: "villager",
  isGameStarted: false
});


export const gameSlice = createSlice({
  name: GAME_FEATURE_KEY,
  initialState: initialGameState,
  reducers: {
    startConnecting: (state => {
      return {
        ...state,
        isEstablishingConnection: true
      }
    }),
    connectionEstablished: (state => {
      return {
        ...state,
        isConnected: true,
        isEstablishingConnection: true
      }
    }),
    setSelfId: (state, action) => {
      return {
        ...state,
        selfId: action.payload.selfId
      }
    },
    sendUser: ((state, action: PayloadAction<{ userName: string }>) => {
      return;
    }),
    requestAllUsers: () => { return },
    receiveAllUsers: ((state, action: PayloadAction<{
      users: User[]
    }>) => {
      return {
        ...state,
        users: action.payload.users
      }
    }),
    sendGameConfig: ((state, action: PayloadAction<{ gameConfig: GameConfig }>) => {
      return;
    }),
    setGameConfig: (state, action: PayloadAction<{
      gameConfig: GameConfig
    }>) => {
      return {
        ...state,
        gameConfig: action.payload.gameConfig
      }
    },
    sendGameStart: (() => {
      return;
    }),
    requestRole: () => { return },
    receiveRole: ((state, action: PayloadAction<{
      selfRole: Role
    }>) => {
      return {
        ...state,
        selfRole: action.payload.selfRole
      }
    }),
    receiveGameStart: (state => {
      return {
        ...state,
        isGameStarted: true
      }
    }),
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
const { selectAll, selectEntities } = gameAdapter.getSelectors();

export const getGameState = (rootState: any): GameState =>
  rootState[GAME_FEATURE_KEY];

export const selectSelfId = createSelector(getGameState, (state) => state.selfId);
export const selectUsers = createSelector(getGameState, (state) => state.users);
export const selectGameConfig = createSelector(getGameState, (state) => state.gameConfig);
export const selectIsGameStarted = createSelector(getGameState, (state) => state.isGameStarted);
export const selectSelfRole = createSelector(getGameState, (state) => state.selfRole);