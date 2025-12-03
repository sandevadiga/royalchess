import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  navigation: {
    currentRoute: string;
    previousRoute: string | null;
  };
  network: {
    isConnected: boolean;
    isOnline: boolean;
  };
  ui: {
    loading: {
      global: boolean;
    };
  };
}

const initialState: AppState = {
  navigation: {
    currentRoute: '/(tabs)',
    previousRoute: null,
  },
  network: {
    isConnected: true,
    isOnline: true,
  },
  ui: {
    loading: {
      global: false,
    },
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.navigation.previousRoute = state.navigation.currentRoute;
      state.navigation.currentRoute = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<{ isConnected: boolean; isOnline: boolean }>) => {
      state.network = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.ui.loading.global = action.payload;
    },
  },
});

export const { setCurrentRoute, setNetworkStatus, setGlobalLoading } = appSlice.actions;
export default appSlice.reducer;