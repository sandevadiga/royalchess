import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  data?: any;
}

interface LogsState {
  entries: LogEntry[];
  settings: {
    level: 'error' | 'warn' | 'info' | 'debug';
    maxEntries: number;
  };
}

const initialState: LogsState = {
  entries: [],
  settings: {
    level: 'info',
    maxEntries: 1000,
  },
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<Omit<LogEntry, 'id' | 'timestamp'>>) => {
      try {
        const entry: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...action.payload,
        };
        
        state.entries.unshift(entry);
        
        // Keep only max entries
        const maxEntries = state.settings.maxEntries || 1000;
        if (state.entries.length > maxEntries) {
          state.entries = state.entries.slice(0, maxEntries);
        }
      } catch (error) {
        console.error('Failed to add log entry:', error);
        // Ensure entries array exists
        if (!state.entries) {
          state.entries = [];
        }
      }
    },
  },
});

export const { addLog } = logsSlice.actions;
export default logsSlice.reducer;