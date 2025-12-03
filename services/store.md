# Redux Store Architecture

## Complete State Structure

```typescript
interface RootState {
  user: UserState;
  game: GameState;
  theme: ThemeState;
  language: LanguageState;
  session: SessionState;
  logs: LogsState;
  sound: SoundState;
  multiplayer: MultiplayerState;
  app: AppState;
}
```

## 1. User Service State

```typescript
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
  };
  authentication: {
    isLoggedIn: boolean;
    token: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
  };
}

// Initial State
const userInitialState: UserState = {
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
  },
  authentication: {
    isLoggedIn: false,
    token: null,
    refreshToken: null,
    expiresAt: null,
  },
};
```

## 2. Game Service State

```typescript
interface GameState {
  current: {
    id: string | null;
    fen: string;
    pgn: string;
    moves: Move[];
    turn: 'white' | 'black';
    status: 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned';
    playerColor: 'white' | 'black';
    opponentType: 'computer' | 'human';
    difficulty: 1 | 2 | 3 | 4 | 5;
    timeControl: {
      initial: number;
      increment: number;
      whiteTime: number;
      blackTime: number;
    };
  };
  history: GameRecord[];
  settings: {
    showLegalMoves: boolean;
    showCoordinates: boolean;
    enablePremoves: boolean;
    confirmMoves: boolean;
  };
  analysis: {
    isAnalyzing: boolean;
    bestMove: string | null;
    evaluation: number | null;
  };
}

// Initial State
const gameInitialState: GameState = {
  current: {
    id: null,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    pgn: '',
    moves: [],
    turn: 'white',
    status: 'playing',
    playerColor: 'white',
    opponentType: 'computer',
    difficulty: 3,
    timeControl: {
      initial: 600,
      increment: 0,
      whiteTime: 600,
      blackTime: 600,
    },
  },
  history: [],
  settings: {
    showLegalMoves: true,
    showCoordinates: true,
    enablePremoves: false,
    confirmMoves: false,
  },
  analysis: {
    isAnalyzing: false,
    bestMove: null,
    evaluation: null,
  },
};
```

## 3. Theme Service State

```typescript
interface ThemeState {
  current: {
    mode: 'light' | 'dark' | 'auto';
    boardTheme: 'classic' | 'wood' | 'marble' | 'neon' | 'glass';
    pieceSet: 'classic' | 'modern' | 'medieval' | 'cartoon';
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
    };
  };
  available: {
    boardThemes: BoardTheme[];
    pieceSets: PieceSet[];
    colorSchemes: ColorScheme[];
  };
  customization: {
    boardSize: number;
    animationSpeed: 'slow' | 'normal' | 'fast';
    highlightLastMove: boolean;
    highlightCheck: boolean;
  };
}

// Initial State
const themeInitialState: ThemeState = {
  current: {
    mode: 'auto',
    boardTheme: 'classic',
    pieceSet: 'classic',
    colorScheme: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
    },
  },
  available: {
    boardThemes: [],
    pieceSets: [],
    colorSchemes: [],
  },
  customization: {
    boardSize: 300,
    animationSpeed: 'normal',
    highlightLastMove: true,
    highlightCheck: true,
  },
};
```

## 4. Language Service State

```typescript
interface LanguageState {
  current: {
    code: string;
    name: string;
    direction: 'ltr' | 'rtl';
  };
  available: Language[];
  translations: {
    [key: string]: string;
  };
  loading: boolean;
  error: string | null;
}

// Initial State
const languageInitialState: LanguageState = {
  current: {
    code: 'en',
    name: 'English',
    direction: 'ltr',
  },
  available: [
    { code: 'en', name: 'English', direction: 'ltr' },
    { code: 'es', name: 'Español', direction: 'ltr' },
    { code: 'fr', name: 'Français', direction: 'ltr' },
    { code: 'ar', name: 'العربية', direction: 'rtl' },
  ],
  translations: {},
  loading: false,
  error: null,
};
```

## 5. Session Service State

```typescript
interface SessionState {
  current: {
    id: string;
    startTime: string;
    lastActivity: string;
    isActive: boolean;
  };
  savedGames: SavedGame[];
  autoSave: {
    enabled: boolean;
    interval: number;
    lastSave: string | null;
  };
  recovery: {
    hasRecoverableGame: boolean;
    gameData: any | null;
  };
}

// Initial State
const sessionInitialState: SessionState = {
  current: {
    id: '',
    startTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    isActive: true,
  },
  savedGames: [],
  autoSave: {
    enabled: true,
    interval: 30000, // 30 seconds
    lastSave: null,
  },
  recovery: {
    hasRecoverableGame: false,
    gameData: null,
  },
};
```

## 6. Logs Service State

```typescript
interface LogsState {
  game: {
    moves: MoveLog[];
    events: GameEvent[];
  };
  system: {
    errors: ErrorLog[];
    performance: PerformanceLog[];
    debug: DebugLog[];
  };
  analytics: {
    events: AnalyticsEvent[];
    sessions: SessionAnalytics[];
  };
  settings: {
    level: 'error' | 'warn' | 'info' | 'debug';
    maxEntries: number;
    enableAnalytics: boolean;
  };
}

// Initial State
const logsInitialState: LogsState = {
  game: {
    moves: [],
    events: [],
  },
  system: {
    errors: [],
    performance: [],
    debug: [],
  },
  analytics: {
    events: [],
    sessions: [],
  },
  settings: {
    level: 'info',
    maxEntries: 1000,
    enableAnalytics: true,
  },
};
```

## 7. Sound Service State

```typescript
interface SoundState {
  settings: {
    enabled: boolean;
    masterVolume: number;
    moveVolume: number;
    uiVolume: number;
    musicVolume: number;
  };
  current: {
    moveSoundSet: 'classic' | 'modern' | 'wooden' | 'digital';
    backgroundMusic: string | null;
    isPlaying: boolean;
  };
  available: {
    moveSounds: SoundSet[];
    backgroundTracks: MusicTrack[];
  };
}

// Initial State
const soundInitialState: SoundState = {
  settings: {
    enabled: true,
    masterVolume: 0.8,
    moveVolume: 0.7,
    uiVolume: 0.6,
    musicVolume: 0.3,
  },
  current: {
    moveSoundSet: 'classic',
    backgroundMusic: null,
    isPlaying: false,
  },
  available: {
    moveSounds: [],
    backgroundTracks: [],
  },
};
```

## 8. Multiplayer Service State

```typescript
interface MultiplayerState {
  connection: {
    status: 'disconnected' | 'connecting' | 'connected' | 'error';
    serverId: string | null;
    latency: number;
  };
  matchmaking: {
    isSearching: boolean;
    preferences: {
      timeControl: string;
      ratingRange: [number, number];
      color: 'white' | 'black' | 'random';
    };
    queue: {
      position: number;
      estimatedWait: number;
    };
  };
  currentMatch: {
    id: string | null;
    opponent: Player | null;
    spectators: Player[];
    chat: ChatMessage[];
  };
  friends: {
    list: Friend[];
    online: string[];
    invitations: Invitation[];
  };
}

// Initial State
const multiplayerInitialState: MultiplayerState = {
  connection: {
    status: 'disconnected',
    serverId: null,
    latency: 0,
  },
  matchmaking: {
    isSearching: false,
    preferences: {
      timeControl: '10+0',
      ratingRange: [1000, 1400],
      color: 'random',
    },
    queue: {
      position: 0,
      estimatedWait: 0,
    },
  },
  currentMatch: {
    id: null,
    opponent: null,
    spectators: [],
    chat: [],
  },
  friends: {
    list: [],
    online: [],
    invitations: [],
  },
};
```

## 9. App Service State

```typescript
interface AppState {
  navigation: {
    currentRoute: string;
    previousRoute: string | null;
    params: any;
  };
  network: {
    isConnected: boolean;
    connectionType: 'wifi' | 'cellular' | 'none';
    isOnline: boolean;
  };
  ui: {
    loading: {
      global: boolean;
      operations: { [key: string]: boolean };
    };
    modals: {
      [key: string]: {
        visible: boolean;
        data?: any;
      };
    };
    notifications: Notification[];
  };
  device: {
    platform: 'ios' | 'android' | 'web';
    version: string;
    screenSize: {
      width: number;
      height: number;
    };
    orientation: 'portrait' | 'landscape';
  };
  performance: {
    fps: number;
    memoryUsage: number;
    renderTime: number;
  };
}

// Initial State
const appInitialState: AppState = {
  navigation: {
    currentRoute: '/(tabs)',
    previousRoute: null,
    params: {},
  },
  network: {
    isConnected: true,
    connectionType: 'wifi',
    isOnline: true,
  },
  ui: {
    loading: {
      global: false,
      operations: {},
    },
    modals: {},
    notifications: [],
  },
  device: {
    platform: 'ios',
    version: '1.0.0',
    screenSize: {
      width: 375,
      height: 812,
    },
    orientation: 'portrait',
  },
  performance: {
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
  },
};
```

## Data Types

```typescript
// Common Types
interface Move {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  san: string;
  timestamp: string;
}

interface GameRecord {
  id: string;
  date: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  rating: number;
  ratingChange: number;
  moves: Move[];
  duration: number;
}

interface RatingHistory {
  date: string;
  rating: number;
  change: number;
  gameId: string;
}

interface Player {
  id: string;
  name: string;
  rating: number;
  avatar?: string;
}

interface ChatMessage {
  id: string;
  playerId: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system' | 'emote';
}
```