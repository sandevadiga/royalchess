import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Chess } from 'chess.js';
import { useAppDispatch, useAppSelector } from '../hooks';
import { startNewGame, migrateGameState, undoToMove } from './gameSlice';
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
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[]; black: string[] }>({
    white: [],
    black: []
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize game
  useEffect(() => {
    // Ensure navigation state exists (migration)
    dispatch(migrateGameState());
    
    const timeConfig = getTimeControl(timeControl);
    dispatch(startNewGame({
      playerColor,
      difficulty,
      opponentType: 'computer',
      timeControl
    }));
  }, []);
  
  // Game engine config
  const engineConfig: GameEngineConfig = useMemo(() => ({
    chess,
    dispatch,
    playerColor,
    difficulty,
    timeControl: {
      initial: game.current.timeControl.initial,
      increment: game.current.timeControl.increment
    }
  }), [chess, dispatch, playerColor, difficulty, game.current.timeControl.initial, game.current.timeControl.increment]);
  
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
    
    // Only allow moves at live position
    if (!game.navigation?.isLivePosition) {
      console.log('❌ Player move blocked: not at live position');
      return;
    }
    
    handlePlayerMove(
      engineConfig,
      moveInput,
      (newFen, captured) => {
        console.log('✅ Player move success, new FEN:', newFen);
        setLastMove({ from: moveInput.from, to: moveInput.to });
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
  }, [chess, gameEnded, playerColor, engineConfig, onGameEnd, game.navigation?.isLivePosition]);
  
  // Sync chess engine with navigation state
  useEffect(() => {
    if (!game.navigation) return;
    
    const moves = game.current.moves;
    const navIndex = game.navigation.currentMoveIndex;
    const isLive = game.navigation.isLivePosition;
    
    // Determine which moves to replay
    const movesToReplay = navIndex === -1 ? [] : moves.slice(0, navIndex + 1);
    
    // Rebuild position
    const newChess = new Chess();
    let newCaptured = { white: [], black: [] };
    
    try {
      for (const move of movesToReplay) {
        const result = newChess.move({ from: move.from, to: move.to, promotion: move.promotion });
        if (!result) {
          console.error('❌ Invalid move during sync, resetting game');
          chess.reset();
          setFen(chess.fen());
          setCapturedPieces({ white: [], black: [] });
          setLastMove(null);
          return;
        }
        if (result.captured) {
          newCaptured[result.color === 'w' ? 'black' : 'white'].push(result.captured);
        }
      }
      
      const newFen = newChess.fen();
      // Always sync the chess engine to match the current position
      console.log('🔄 Syncing to position:', navIndex, 'FEN:', newFen);
      chess.load(newFen);
      setFen(newFen);
      setCapturedPieces(newCaptured);
      setLastMove(movesToReplay.length > 0 ? 
        { from: movesToReplay[movesToReplay.length - 1].from, to: movesToReplay[movesToReplay.length - 1].to } : 
        null
      );
    } catch (error) {
      console.error('❌ Sync failed, resetting:', error);
      chess.reset();
      setFen(chess.fen());
      setCapturedPieces({ white: [], black: [] });
      setLastMove(null);
    }
  }, [game.current.moves, game.navigation?.currentMoveIndex, game.navigation?.isLivePosition]);
  
  // Handle computer move
  useEffect(() => {
    console.log('🤖 Computer Move Effect:', { 
      gameEnded, 
      status: game.current.status, 
      chessTurn: chess.turn(), 
      playerColor,
      isLivePosition: game.navigation?.isLivePosition,
      movesLength: game.current.moves.length
    });
    
    if (gameEnded) {
      console.log('❌ Computer move blocked: game ended');
      return;
    }
    if (game.current.status !== 'playing') {
      console.log('❌ Computer move blocked: status not playing');
      return;
    }
    
    // Only allow computer moves at live position
    if (!game.navigation?.isLivePosition) {
      console.log('❌ Computer move blocked: not at live position');
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
          (newFen, captured, move) => {
            console.log('✅ Computer move success, new FEN:', newFen);
            if (move) {
              setLastMove({ from: move.from, to: move.to });
            }
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
  }, [fen, game.current.status, gameEnded, playerColor, difficulty, engineConfig, onGameEnd, game.navigation?.isLivePosition, game.current.moves.length]);
  

  
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
    onPlayerMove,
    lastMove
  };
};
