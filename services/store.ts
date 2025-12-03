import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers (will create these next)
import userReducer from './user/userSlice';
import gameReducer from './game/gameSlice';
import themeReducer from './theme/themeSlice';
import languageReducer from './language/languageSlice';
import sessionReducer from './session/sessionSlice';
import logsReducer from './logs/logsSlice';
import soundReducer from './sound/soundSlice';
import multiplayerReducer from './multiplayer/multiplayerSlice';
import appReducer from './app/appSlice';

const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer,
  theme: themeReducer,
  language: languageReducer,
  session: sessionReducer,
  logs: logsReducer,
  sound: soundReducer,
  multiplayer: multiplayerReducer,
  app: appReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'game', 'theme', 'language', 'sound'], // Only persist these
  blacklist: ['app', 'multiplayer', 'logs'], // Don't persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;