import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SoundState {
  settings: {
    enabled: boolean;
    masterVolume: number;
    moveVolume: number;
    uiVolume: number;
  };
  current: {
    moveSoundSet: 'classic' | 'modern' | 'wooden' | 'digital';
  };
}

const initialState: SoundState = {
  settings: {
    enabled: true,
    masterVolume: 0.8,
    moveVolume: 0.7,
    uiVolume: 0.6,
  },
  current: {
    moveSoundSet: 'classic',
  },
};

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    updateSoundSettings: (state, action: PayloadAction<Partial<SoundState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setSoundSet: (state, action: PayloadAction<SoundState['current']['moveSoundSet']>) => {
      state.current.moveSoundSet = action.payload;
    },
  },
});

export const { updateSoundSettings, setSoundSet } = soundSlice.actions;
export default soundSlice.reducer;