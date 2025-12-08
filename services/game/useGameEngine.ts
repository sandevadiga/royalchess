import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { useAppDispatch, useAppSelector } from '../hooks';
import { startNewGame } from './gameSlice';
import { handlePlayerMove, handleComputerMove, handleTimerTick, GameEngineConfig } from './gameEngine';
import { getTimeControl, TimeControlType, GameResult } from '../../utils/gameRules';

export interface UseGameEngineProps {
  playerColor: 'white' | 'black';
  difficulty: number;
  timeControl: TimeControlType;
}

export const useGameEngine = ({ playerColor, difficulty, timeControl }: UseGameEngineProps) => {
  const dispatch = useAppDispatch();
  const game = useAppSelector(state => state.game);
  
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [gameEnded, setGameEnded] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[]; black: string[] }>({
    white: [],
    black: []
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize game
  useEffect(() => {
    const timeConfig = getTimeControl(timeControl);
    dispatch(startNewGame({
      playerColor,
      difficulty,
      opponentType: 'computer',
      timeControl
    }));
  }, []);
  
  // Game engine config
  const engineConfig: GameEngineConfig = {
    chess,
    dispatch,
    playerColor,
    difficulty,
    timeControl: {
      initial: game.current.timeControl.initial,
      increment: game.current.timeControl.increment
    }
  };
  
  // Handle game end
  const onGameEnd = useCallback((result: GameResult) => {
    setGameEnded(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);
  
  // Handle player move
  const onPlayerMove = useCallback((moveInput: any) => {
    if (gameEnded) return;
    if (chess.turn() !== playerColor.charAt(0)) return;
    
    handlePlayerMove(
      engineConfig,
      moveInput,
      (newFen, captured) => {
        setFen(newFen);
        if (captured) {
          setCapturedPieces(prev => ({
            ...prev,
            white: [...prev.white, captured]
          }));
        }
      },
      onGameEnd
    );
  }, [chess, gameEnded, playerColor, engineConfig, onGameEnd]);
  
  // Handle computer move
  useEffect(() => {
    if (gameEnded) return;
    if (game.current.status !== 'playing') return;
    
    const currentTurn = chess.turn();
    const isComputerTurn = currentTurn !== playerColor.charAt(0);
    
    if (isComputerTurn) {
      const timeout = setTimeout(() => {
        handleComputerMove(
          engineConfig,
          (newFen, captured) => {
            setFen(newFen);
            if (captured) {
              setCapturedPieces(prev => ({
                ...prev,
                black: [...prev.black, captured]
              }));
            }
          },
          onGameEnd
        );
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [fen, game.current.status, gameEnded, chess, playerColor, engineConfig, onGameEnd]);
  
  // Timer - use ref to get fresh state
  const gameStateRef = useRef(game.current);
  
  useEffect(() => {
    gameStateRef.current = game.current;
  }, [game.current]);
  
  useEffect(() => {
    console.log('⏱️ Timer Effect:', {
      gameEnded,
      status: game.current.status,
      timeControl
    });
    
    if (gameEnded) {
      console.log('⏱️ Timer: Game ended, not starting timer');
      return;
    }
    if (game.current.status !== 'playing') {
      console.log('⏱️ Timer: Game not playing, status:', game.current.status);
      return;
    }
    if (timeControl === 'timeless') {
      console.log('⏱️ Timer: Timeless mode, no timer');
      return;
    }
    
    console.log('⏱️ Timer: Starting interval');
    timerRef.current = setInterval(() => {
      const currentState = gameStateRef.current;
      handleTimerTick(
        dispatch,
        currentState.turn,
        currentState.timeControl.whiteTime,
        currentState.timeControl.blackTime,
        playerColor,
        onGameEnd
      );
    }, 1000);
    
    return () => {
      console.log('⏱️ Timer: Cleaning up interval');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [game.current.status, gameEnded, timeControl, dispatch, playerColor, onGameEnd]);
  
  return {
    fen,
    chess,
    gameEnded,
    capturedPieces,
    onPlayerMove
  };
};
