import { Chess, Move as ChessMove } from 'chess.js';

export interface MoveData {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  san: string;
  timestamp: string;
}

export interface MoveResult {
  success: boolean;
  move: MoveData | null;
  fen: string;
  pgn: string;
  captured?: string;
}

/**
 * Execute and validate a move
 */
export const executeMove = (
  chess: Chess,
  moveInput: any
): MoveResult => {
  try {
    const move = chess.move(moveInput);
    
    if (!move) {
      return {
        success: false,
        move: null,
        fen: chess.fen(),
        pgn: chess.pgn()
      };
    }
    
    const moveData: MoveData = {
      from: move.from,
      to: move.to,
      piece: move.piece,
      captured: move.captured,
      promotion: move.promotion,
      san: move.san,
      timestamp: new Date().toISOString()
    };
    
    return {
      success: true,
      move: moveData,
      fen: chess.fen(),
      pgn: chess.pgn(),
      captured: move.captured
    };
  } catch (error) {
    return {
      success: false,
      move: null,
      fen: chess.fen(),
      pgn: chess.pgn()
    };
  }
};

/**
 * Get all legal moves
 */
export const getLegalMoves = (chess: Chess): ChessMove[] => {
  return chess.moves({ verbose: true });
};

/**
 * Get captured pieces from move history
 */
export const getCapturedPieces = (moves: MoveData[]): {
  white: string[];
  black: string[];
} => {
  const captured = { white: [], black: [] };
  
  moves.forEach((move, index) => {
    if (move.captured) {
      // Even index = white's move, odd = black's move
      if (index % 2 === 0) {
        captured.white.push(move.captured);
      } else {
        captured.black.push(move.captured);
      }
    }
  });
  
  return captured;
};
