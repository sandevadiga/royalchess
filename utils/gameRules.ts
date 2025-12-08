import { Chess } from 'chess.js';

export type TimeControlType = 'blitz' | 'rapid' | 'classical' | 'timeless';
export type GameResult = 'win' | 'loss' | 'draw';
export type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned' | 'timeout';

export interface TimeControlConfig {
  initial: number;
  increment: number;
}

/**
 * Get time control configuration (Lichess standard)
 */
export const getTimeControl = (type: TimeControlType): TimeControlConfig => {
  switch (type) {
    case 'blitz':
      return { initial: 300, increment: 0 }; // 5+0
    case 'rapid':
      return { initial: 600, increment: 0 }; // 10+0
    case 'classical':
      return { initial: 1800, increment: 0 }; // 30+0
    case 'timeless':
      return { initial: 0, increment: 0 }; // No time limit
    default:
      return { initial: 300, increment: 0 };
  }
};

/**
 * Check if game has ended and determine result
 */
export const checkGameEnd = (chess: Chess, currentPlayer: 'white' | 'black'): {
  ended: boolean;
  status: GameStatus;
  result: GameResult | null;
} => {
  if (chess.isCheckmate()) {
    return {
      ended: true,
      status: 'checkmate',
      result: chess.turn() === currentPlayer.charAt(0) ? 'loss' : 'win'
    };
  }
  
  if (chess.isStalemate()) {
    return { ended: true, status: 'stalemate', result: 'draw' };
  }
  
  if (chess.isDraw()) {
    return { ended: true, status: 'draw', result: 'draw' };
  }
  
  return { ended: false, status: 'playing', result: null };
};

/**
 * Check timeout and determine winner
 */
export const checkTimeout = (
  whiteTime: number,
  blackTime: number,
  playerColor: 'white' | 'black'
): { timeout: boolean; result: GameResult | null } => {
  if (whiteTime <= 0) {
    return { timeout: true, result: playerColor === 'white' ? 'loss' : 'win' };
  }
  if (blackTime <= 0) {
    return { timeout: true, result: playerColor === 'black' ? 'loss' : 'win' };
  }
  return { timeout: false, result: null };
};
