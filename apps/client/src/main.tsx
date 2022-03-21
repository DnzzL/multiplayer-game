import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { GAME_FEATURE_KEY, gameReducer } from './app/store/game.slice';
import gameMiddleware from './app/store/gameMiddleware';

const store = configureStore({
  reducer: {
    [GAME_FEATURE_KEY]: gameReducer,
  },
  // Additional middleware can be passed to this array
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameMiddleware), // causes babel error with shared types
  devTools: process.env['NODE_ENV'] !== 'production',
  // Optional Redux store enhancers
  enhancers: [],
});

ReactDOM.render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>,
  document.getElementById('root')
);
