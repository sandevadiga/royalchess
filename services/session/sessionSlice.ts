import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  current: {
    id: string;
    startTime: string;
    lastActivity: string;
    isActive: boolean;
  };
  autoSave: {
    enabled: boolean;
    lastSave: string | null;
  };
}

const initialState: SessionState = {
  current: {
    id: Date.now().toString(),
    startTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    isActive: true,
  },
  autoSave: {
    enabled: true,
    lastSave: null,
  },
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    updateActivity: (state) => {
      state.current.lastActivity = new Date().toISOString();
    },
    saveGame: (state) => {
      state.autoSave.lastSave = new Date().toISOString();
    },
  },
});

export const { updateActivity, saveGame } = sessionSlice.actions;
export default sessionSlice.reducer;