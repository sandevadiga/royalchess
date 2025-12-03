import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MultiplayerState {
  connection: {
    status: 'disconnected' | 'connecting' | 'connected' | 'error';
    latency: number;
  };
  matchmaking: {
    isSearching: boolean;
  };
}

const initialState: MultiplayerState = {
  connection: {
    status: 'disconnected',
    latency: 0,
  },
  matchmaking: {
    isSearching: false,
  },
};

const multiplayerSlice = createSlice({
  name: 'multiplayer',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<MultiplayerState['connection']['status']>) => {
      state.connection.status = action.payload;
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.matchmaking.isSearching = action.payload;
    },
  },
});

export const { setConnectionStatus, setSearching } = multiplayerSlice.actions;
export default multiplayerSlice.reducer;