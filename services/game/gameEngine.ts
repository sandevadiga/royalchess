import { Chess } from 'chess.js';
import { AppDispatch } from '../store';
import { makeMove, updateGameState, updateTimer, endGame } from './gameSlice';
import { updateStatistics, adjustComputerDifficulty } from '../user/userSlice';
import { executeMove, MoveData } from '../../utils/moveHandler';
import { checkGameEnd, checkTimeout, GameResult } from '../../utils/gameRules';
import { generateComputerMove } from '../../utils/computerAI';
import { decrementTimer, addIncrement, switchTurn, TimerState } from '../../utils/timerHandler';

export interface GameEngineConfig {
  chess: Chess;
  dispatch: AppDispatch;
  playerColor: 'white' | 'black';
  difficulty: number;
  timeControl: {
    initial: number;
    increment: number;
  };
}

/**
 * Handle player move
 */
export const handlePlayerMove = (
  config: GameEngineConfig,
  moveInput: any,
  onSuccess: (fen: string, captured?: string) => void,
  onGameEnd: (result: GameResult) => void
) => {
  const { chess, dispatch, playerColor, timeControl } = config;
  
  // Execute move
  const result = executeMove(chess, moveInput);
  
  if (!result.success || !result.move) return;
  
  // Update Redux
  dispatch(makeMove(result.move));
  dispatch(updateGameState({ fen: result.fen, pgn: result.pgn }));
  
  // Add increment if configured
  if (timeControl.increment > 0) {
    // Increment will be added by timer handler
  }
  
  // Check game end
  const gameEnd = checkGameEnd(chess, playerColor);
  if (gameEnd.ended && gameEnd.result) {
    dispatch(endGame({ status: gameEnd.status, result: gameEnd.result }));
    dispatch(updateStatistics(gameEnd.result));
    dispatch(adjustComputerDifficulty(gameEnd.result));
    onGameEnd(gameEnd.result);
    return;
  }
  
  // Notify success
  onSuccess(result.fen, result.captured);
};

/**
 * Handle computer move
 */
export const handleComputerMove = (
  config: GameEngineConfig,
  onSuccess: (fen: string, captured?: string, move?: MoveData) => void,
  onGameEnd: (result: GameResult) => void
): boolean => {
  const { chess, dispatch, playerColor, difficulty } = config;
  
  console.log('🤖 handleComputerMove called:', { turn: chess.turn(), difficulty });
  
  // Generate computer move
  const computerMove = generateComputerMove(chess, difficulty);
  console.log('🎲 Generated move:', computerMove);
  
  if (!computerMove) {
    console.log('❌ No computer move generated!');
    return false;
  }
  
  // Execute move
  const result = executeMove(chess, computerMove);
  console.log('📋 Move execution result:', { success: result.success, move: result.move });
  
  if (!result.success || !result.move) {
    console.log('❌ Move execution failed!');
    return false;
  }
  
  // Update Redux
  dispatch(makeMove(result.move));
  dispatch(updateGameState({ fen: result.fen, pgn: result.pgn }));
  console.log('✅ Redux updated with computer move');
  
  // Check game end
  const gameEnd = checkGameEnd(chess, playerColor);
  if (gameEnd.ended && gameEnd.result) {
    console.log('🏁 Game ended:', gameEnd);
    dispatch(endGame({ status: gameEnd.status, result: gameEnd.result }));
    dispatch(updateStatistics(gameEnd.result));
    dispatch(adjustComputerDifficulty(gameEnd.result));
    onGameEnd(gameEnd.result);
    return true;
  }
  
  // Notify success
  onSuccess(result.fen, result.captured, result.move);
  return true;
};

/**
 * Handle timer tick
 */
export const handleTimerTick = (
  dispatch: AppDispatch,
  currentPlayer: 'white' | 'black',
  whiteTime: number,
  blackTime: number,
  playerColor: 'white' | 'black',
  onTimeout: (result: GameResult) => void
) => {
  const newTime = currentPlayer === 'white' ? whiteTime - 1 : blackTime - 1;
  
  if (newTime < 0) {
    const timeoutCheck = checkTimeout(
      currentPlayer === 'white' ? 0 : whiteTime,
      currentPlayer === 'black' ? 0 : blackTime,
      playerColor
    );
    
    if (timeoutCheck.timeout && timeoutCheck.result) {
      dispatch(endGame({ status: 'timeout', result: timeoutCheck.result }));
      dispatch(updateStatistics(timeoutCheck.result));
      dispatch(adjustComputerDifficulty(timeoutCheck.result));
      onTimeout(timeoutCheck.result);
    }
    return;
  }
  
  dispatch(updateTimer({ player: currentPlayer, time: Math.max(0, newTime) }));
};
