import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface GameState {
  current: {
    id: string | null;
    fen: string;
    pgn: string;
    moves: Move[];
    turn: 'white' | 'black';
    status: 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned' | 'timeout';
    playerColor: 'white' | 'black';
    opponentType: 'computer' | 'human';
    difficulty: number; // ELO rating 800-2400
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

const initialState: GameState = {
  current: {
    id: null,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    pgn: '',
    moves: [],
    turn: 'white',
    status: 'playing',
    playerColor: 'white',
    opponentType: 'computer',
    difficulty: 1200,
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

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNewGame: (state, action: PayloadAction<{ 
      playerColor: 'white' | 'black'; 
      difficulty: number; // ELO rating 800-2400
      opponentType: 'computer' | 'human';
      timeControl?: 'blitz' | 'rapid' | 'classical' | 'timeless';
    }>) => {
      const getTimeSettings = (timeControl: string) => {
        switch (timeControl) {
          case 'blitz': return { initial: 300, increment: 0 };
          case 'rapid': return { initial: 600, increment: 0 };
          case 'classical': return { initial: 1800, increment: 0 };
          case 'timeless': return { initial: 30, increment: 30 };
          default: return { initial: 300, increment: 0 };
        }
      };
      
      const timeSettings = getTimeSettings(action.payload.timeControl || 'blitz');
      
      state.current = {
        ...initialState.current,
        id: Date.now().toString(),
        playerColor: action.payload.playerColor,
        difficulty: action.payload.difficulty,
        opponentType: action.payload.opponentType,
        timeControl: {
          initial: timeSettings.initial,
          increment: timeSettings.increment,
          whiteTime: timeSettings.initial,
          blackTime: timeSettings.initial,
        },
      };
    },
    makeMove: (state, action: PayloadAction<Move>) => {
      try {
        // Ensure moves array exists
        if (!state.current.moves) {
          state.current.moves = [];
        }
        
        state.current.moves.push(action.payload);
        state.current.turn = state.current.turn === 'white' ? 'black' : 'white';
      } catch (error) {
        console.error('Failed to make move:', error);
        // Ensure moves array exists even if push fails
        if (!state.current.moves) {
          state.current.moves = [];
        }
      }
    },
    updateGameState: (state, action: PayloadAction<{ fen: string; pgn: string }>) => {
      try {
        // Validate payload exists
        if (!action.payload) {
          console.warn('Invalid payload for updateGameState');
          return;
        }
        
        // Update FEN with validation
        if (typeof action.payload.fen === 'string' && action.payload.fen.trim()) {
          state.current.fen = action.payload.fen;
        }
        
        // Update PGN with validation
        if (typeof action.payload.pgn === 'string') {
          state.current.pgn = action.payload.pgn;
        }
      } catch (error) {
        console.error('Failed to update game state:', error);
      }
    },
    endGame: (state, action: PayloadAction<{ 
      status: 'checkmate' | 'stalemate' | 'draw' | 'resigned' | 'timeout';
      result: 'win' | 'loss' | 'draw';
    }>) => {
      try {
        state.current.status = action.payload.status;
        
        // Add to history
        if (state.current.id) {
          const gameRecord: GameRecord = {
            id: state.current.id,
            date: new Date().toISOString(),
            opponent: state.current.opponentType === 'computer' ? 'Computer' : 'Human',
            result: action.payload.result,
            rating: 1200, // Will be updated from user state
            ratingChange: 0, // Will be calculated
            moves: state.current.moves || [],
            duration: 0, // Will be calculated
          };
          
          // Ensure history array exists
          if (!state.history) {
            state.history = [];
          }
          
          state.history.unshift(gameRecord);
        }
      } catch (error) {
        console.error('Failed to end game:', error);
        // Ensure game status is still updated
        state.current.status = action.payload.status;
      }
    },
    updateSettings: (state, action: PayloadAction<Partial<GameState['settings']>>) => {
      try {
        if (action.payload) {
          state.settings = { ...state.settings, ...action.payload };
        }
      } catch (error) {
        console.error('Failed to update settings:', error);
      }
    },
    updateAnalysis: (state, action: PayloadAction<Partial<GameState['analysis']>>) => {
      try {
        if (action.payload) {
          state.analysis = { ...state.analysis, ...action.payload };
        }
      } catch (error) {
        console.error('Failed to update analysis:', error);
      }
    },
    updateTimer: (state, action: PayloadAction<{ player: 'white' | 'black'; time: number }>) => {
      try {
        if (action.payload.player === 'white') {
          state.current.timeControl.whiteTime = Math.max(0, action.payload.time);
        } else {
          state.current.timeControl.blackTime = Math.max(0, action.payload.time);
        }
      } catch (error) {
        console.error('Failed to update timer:', error);
      }
    },
  },
});

export const {
  startNewGame,
  makeMove,
  updateGameState,
  endGame,
  updateSettings,
  updateAnalysis,
  updateTimer,
} = gameSlice.actions;

export default gameSlice.reducer;