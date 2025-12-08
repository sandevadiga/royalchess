import { Chess, Move } from 'chess.js';

/**
 * Generate computer move based on difficulty (ELO rating)
 * Simple random move for now - can be enhanced with actual AI
 */
export const generateComputerMove = (
  chess: Chess,
  difficulty: number
): Move | null => {
  const moves = chess.moves({ verbose: true });
  
  if (moves.length === 0) return null;
  
  // For now, just random move
  // TODO: Implement difficulty-based AI (Stockfish integration)
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

/**
 * Get difficulty label from ELO rating
 */
export const getDifficultyLabel = (elo: number): string => {
  if (elo < 1000) return 'Beginner';
  if (elo < 1400) return 'Intermediate';
  if (elo < 1800) return 'Advanced';
  if (elo < 2200) return 'Expert';
  return 'Master';
};
