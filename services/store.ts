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

const generatePersistKey = () => {
  const appName = 'royalchess';
  const version = '1.0';
  return `${appName}_${version}_store`;
};

const persistConfig = {
  key: generatePersistKey(),
  storage: AsyncStorage,
  whitelist: ['user', 'game', 'theme', 'language', 'sound'], // Only persist these
  blacklist: ['app', 'multiplayer', 'logs'], // Don't persist these
  debug: __DEV__,

};

type RootReducerType = ReturnType<typeof rootReducer>;

let persistedReducer: typeof rootReducer;
try {
  persistedReducer = persistReducer(persistConfig, rootReducer) as unknown as typeof rootReducer;
} catch (error) {
  console.error('Failed to create persisted reducer:', error);
  persistedReducer = rootReducer;
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

let persistor;
try {
  persistor = persistStore(store);
} catch (error) {
  console.error('Failed to create persistor:', error);
}

export { persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;