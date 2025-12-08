import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RatingHistory {
  date: string;
  rating: number;
  change: number;
  gameId: string;
}

interface UserState {
  profile: {
    id: string | null;
    name: string;
    avatar: string | null;
    isAnonymous: boolean;
    createdAt: string;
  };
  rating: {
    current: number;
    peak: number;
    history: RatingHistory[];
  };
  computerDifficulty: number; // Adaptive AI difficulty (800-2400)
  statistics: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  };
  preferences: {
    favoriteColor: 'white' | 'black' | 'random';
    preferredTimeControl: string;
    autoPromoteQueen: boolean;
    boardColorScheme: 'classic' | 'blue' | 'green' | 'purple' | 'wood';
  };
  authentication: {
    isLoggedIn: boolean;
    token: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
  };
}

const initialState: UserState = {
  profile: {
    id: null,
    name: 'Anonymous',
    avatar: null,
    isAnonymous: true,
    createdAt: new Date().toISOString(),
  },
  rating: {
    current: 1200,
    peak: 1200,
    history: [],
  },
  computerDifficulty: 1200, // Match user rating
  statistics: {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
  },
  preferences: {
    favoriteColor: 'random',
    preferredTimeControl: '10+0',
    autoPromoteQueen: false,
    boardColorScheme: 'classic',
  },
  authentication: {
    isLoggedIn: false,
    token: null,
    refreshToken: null,
    expiresAt: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserState['profile']>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateRating: (state, action: PayloadAction<{ newRating: number; gameId: string }>) => {
      const { newRating, gameId } = action.payload;
      const change = newRating - state.rating.current;
      
      state.rating.history.push({
        date: new Date().toISOString(),
        rating: newRating,
        change,
        gameId,
      });
      
      state.rating.current = newRating;
      if (newRating > state.rating.peak) {
        state.rating.peak = newRating;
      }
    },
    updateStatistics: (state, action: PayloadAction<'win' | 'loss' | 'draw'>) => {
      state.statistics.gamesPlayed += 1;
      
      switch (action.payload) {
        case 'win':
          state.statistics.wins += 1;
          break;
        case 'loss':
          state.statistics.losses += 1;
          break;
        case 'draw':
          state.statistics.draws += 1;
          break;
      }
      
      state.statistics.winRate = state.statistics.wins / state.statistics.gamesPlayed;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    login: (state, action: PayloadAction<{ token: string; refreshToken: string; expiresAt: string }>) => {
      state.authentication = {
        isLoggedIn: true,
        ...action.payload,
      };
      state.profile.isAnonymous = false;
    },
    logout: (state) => {
      state.authentication = {
        isLoggedIn: false,
        token: null,
        refreshToken: null,
        expiresAt: null,
      };
    },
    adjustComputerDifficulty: (state, action: PayloadAction<'win' | 'loss' | 'draw'>) => {
      const change = action.payload === 'win' ? 20 : action.payload === 'loss' ? -20 : 0;
      state.computerDifficulty = Math.max(800, Math.min(2400, state.computerDifficulty + change));
    },
  },
});

export const {
  updateProfile,
  updateRating,
  updateStatistics,
  updatePreferences,
  login,
  logout,
  adjustComputerDifficulty,
} = userSlice.actions;

export default userSlice.reducer;