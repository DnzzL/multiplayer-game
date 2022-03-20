import { fetchGame, gameAdapter, gameReducer } from './game.slice';

describe('game reducer', () => {
  it('should handle initial state', () => {
    const expected = gameAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(gameReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchGames', () => {
    let state = gameReducer(undefined, fetchGame.pending(null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = gameReducer(state, fetchGame.fulfilled([{ id: 1 }], null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = gameReducer(
      state,
      fetchGame.rejected(new Error('Uh oh'), null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
