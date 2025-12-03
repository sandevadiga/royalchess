import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  current: {
    code: string;
    name: string;
    direction: 'ltr' | 'rtl';
  };
  loading: boolean;
}

const initialState: LanguageState = {
  current: {
    code: 'en',
    name: 'English',
    direction: 'ltr',
  },
  loading: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageState['current']>) => {
      state.current = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;