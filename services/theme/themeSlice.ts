import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  current: {
    mode: 'light' | 'dark' | 'auto';
    boardTheme: 'classic' | 'wood' | 'marble' | 'neon' | 'glass';
    pieceSet: 'classic' | 'modern' | 'medieval' | 'cartoon';
  };
  customization: {
    boardSize: number;
    animationSpeed: 'slow' | 'normal' | 'fast';
    highlightLastMove: boolean;
    highlightCheck: boolean;
  };
}

const initialState: ThemeState = {
  current: {
    mode: 'auto',
    boardTheme: 'classic',
    pieceSet: 'classic',
  },
  customization: {
    boardSize: 300,
    animationSpeed: 'normal',
    highlightLastMove: true,
    highlightCheck: true,
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<Partial<ThemeState['current']>>) => {
      state.current = { ...state.current, ...action.payload };
    },
    updateCustomization: (state, action: PayloadAction<Partial<ThemeState['customization']>>) => {
      state.customization = { ...state.customization, ...action.payload };
    },
  },
});

export const { updateTheme, updateCustomization } = themeSlice.actions;
export default themeSlice.reducer;