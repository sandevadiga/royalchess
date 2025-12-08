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
    console.log('🎮 Player Move:', { moveInput, gameEnded, turn: chess.turn(), playerColor });
    if (gameEnded) return;
    if (chess.turn() !== playerColor.charAt(0)) return;
    
    handlePlayerMove(
      engineConfig,
      moveInput,
      (newFen, captured) => {
        console.log('✅ Player move success, new FEN:', newFen);
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
    console.log('🤖 Computer Move Effect:', { 
      gameEnded, 
      status: game.current.status, 
      chessTurn: chess.turn(), 
      playerColor,
      fen 
    });
    
    if (gameEnded) {
      console.log('❌ Computer move blocked: game ended');
      return;
    }
    if (game.current.status !== 'playing') {
      console.log('❌ Computer move blocked: status not playing');
      return;
    }
    
    const currentTurn = chess.turn();
    const isComputerTurn = currentTurn !== playerColor.charAt(0);
    
    console.log('🔍 Turn check:', { currentTurn, playerColor, isComputerTurn });
    
    if (isComputerTurn) {
      console.log('⏳ Computer will move in 1 second...');
      const timeout = setTimeout(() => {
        console.log('🤖 Executing computer move...');
        handleComputerMove(
          engineConfig,
          (newFen, captured) => {
            console.log('✅ Computer move success, new FEN:', newFen);
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
    } else {
      console.log('⏸️ Not computer turn, waiting for player...');
    }
  }, [fen, game.current.status, gameEnded, playerColor, difficulty, engineConfig, onGameEnd]);
  
  // Timer - use ref to get fresh state
  const gameStateRef = useRef(game.current);
  
  useEffect(() => {
    gameStateRef.current = game.current;
  }, [game.current]);
  
  useEffect(() => {
    if (gameEnded || game.current.status !== 'playing' || timeControl === 'timeless') {
      return;
    }
    
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
