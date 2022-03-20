import { GameConfig, Player, User } from '@loup-garou/types';
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
  isEstablishingConnection: boolean;
  isConnected: boolean;
  users: User[],
  players: Player[],
  gameConfig: GameConfig
}

export const gameAdapter = createEntityAdapter<GameEntity>();


export const initialGameState: GameState = gameAdapter.getInitialState({
  isEstablishingConnection: false,
  isConnected: false,
  users: [],
  players: [],
  gameConfig: { "werewolf": 0, "villager": 0, "cupidon": 0, "sorcerer": 0 }
});


export const gameSlice = createSlice({
  name: GAME_FEATURE_KEY,
  initialState: initialGameState,
  reducers: {
    startConnecting: (state => {
      state.isEstablishingConnection = true;
    }),
    connectionEstablished: (state => {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    }),
    receiveAllUsers: ((state, action: PayloadAction<{
      users: User[]
    }>) => {
      state.users = action.payload.users;
    }),
    receiveUser: ((state, action: PayloadAction<{
      user: User
    }>) => {
      state.users.push(action.payload.user);
    }),
    setUsers: (state, action) => {
      state.users = [...state.users, action.payload]
    },
    setPlayers: (state, action) => {
      state.players = [...Object(action.payload)]
    },
    setGameConfig: (state, action) => {
      state.gameConfig = action.payload
    },
    sendUser: ((state, action: PayloadAction<{
      userName: string
    }>) => {
      return;
    })
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

export const selectAllGame = createSelector(getGameState, selectAll);
export const selectGameEntities = createSelector(getGameState, selectEntities);
export const selectUsers = createSelector(getGameState, (state) => state.users);
export const selectPlayers = createSelector(getGameState, (state) => state.players);
export const selectGameConfig = createSelector(getGameState, (state) => state.gameConfig);