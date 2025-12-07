import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../services/hooks';
import { makeMove, updateGameState, startNewGame, updateTimer, endGame } from '../services/game/gameSlice';
import { adjustComputerDifficulty, updateStatistics } from '../services/user/userSlice';
import PlayerInfo from '../components/game/PlayerInfo';

export default function ChessGameScreen() {
  const params = useLocalSearchParams();
  const color = params.color || 'white';
  const difficulty = params.difficulty;
  const timeControl = params.timeControl || 'blitz';
  
  // Validate parameters
  const validColor = ['white', 'black'].includes(color as string) ? color : 'white';
  const validDifficulty = Math.max(800, Math.min(2400, finalDifficulty));
  
  const timeControlLabel = useMemo(() => {
    const labels = {
      blitz: 'Blitz 5min',
      rapid: 'Rapid 10min', 
      classical: 'Classical 30min',
      timeless: 'Timeless'
    };
    return labels[timeControl as keyof typeof labels] || 'Blitz 5min';
  }, [timeControl]);
  
  // Get user data from Redux
  const user = useAppSelector(state => state.user);
  const game = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  
  // Use adaptive difficulty if not specified
  const finalDifficulty = difficulty ? Number(difficulty) : user.computerDifficulty;
  
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [moveTimer, setMoveTimer] = useState(30);
  const [gameEnded, setGameEnded] = useState(false);
  useEffect(() => {
    dispatch(startNewGame({
      playerColor: validColor as 'white' | 'black',
      difficulty: validDifficulty,
      opponentType: 'computer',
      timeControl: timeControl as 'blitz' | 'rapid' | 'classical' | 'timeless',
    }));
  }, []);
  
  useEffect(() => {
    if (game.current.status === 'playing') {
      const timer = setInterval(() => {
        setMoveTimer(prev => prev <= 1 ? 30 : prev - 1);
        
        if (timeControl !== 'timeless') {
          const currentPlayer = game.current.turn;
          const currentTime = currentPlayer === 'white' 
            ? game.current.timeControl.whiteTime 
            : game.current.timeControl.blackTime;
          
          if (currentTime > 0) {
            dispatch(updateTimer({ 
              player: currentPlayer, 
              time: currentTime - 1 
            }));
          }
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeControl, game.current.status]);
  

  const playerRating = useMemo(() => user.rating.current, [user.rating.current]);
  const computerRating = useMemo(() => validDifficulty, [validDifficulty]);

  const handleGameEnd = useCallback((result: 'win' | 'loss' | 'draw') => {
    if (gameEnded) return;
    setGameEnded(true);
    
    const status = chess.isCheckmate() ? 'checkmate' : chess.isStalemate() ? 'stalemate' : 'draw';
    dispatch(endGame({ status, result }));
    dispatch(updateStatistics(result));
    dispatch(adjustComputerDifficulty(result));
  }, [chess, dispatch, gameEnded]);

  const onMove = useCallback((moveData: any) => {
    try {
      const move = chess.move(moveData.move);
      if (move) {
        const newFen = chess.fen();
        setFen(newFen);
        
        dispatch(makeMove({
          from: move.from,
          to: move.to,
          piece: move.piece,
          captured: move.captured,
          promotion: move.promotion,
          san: move.san,
          timestamp: new Date().toISOString(),
        }));
        
        dispatch(updateGameState({
          fen: newFen,
          pgn: chess.pgn(),
        }));
        
        if (timeControl === 'timeless') {
          setMoveTimer(30);
        }
        
        // Check game end
        if (chess.isCheckmate()) {
          handleGameEnd(chess.turn() === validColor ? 'loss' : 'win');
        } else if (chess.isStalemate() || chess.isDraw()) {
          handleGameEnd('draw');
        }
      }
    } catch (error) {
      console.log('Invalid move:', error);
    }
  }, [chess, dispatch, timeControl, handleGameEnd, validColor]);

  const difficultyLabel = useMemo(() => {
    if (validDifficulty < 1000) return 'Beginner';
    if (validDifficulty < 1400) return 'Intermediate';
    if (validDifficulty < 1800) return 'Advanced';
    if (validDifficulty < 2200) return 'Expert';
    return 'Master';
  }, [validDifficulty]);

  const opponentTime = useMemo(() => validColor === 'white' 
    ? game.current.timeControl.blackTime 
    : game.current.timeControl.whiteTime, [validColor, game.current.timeControl.blackTime, game.current.timeControl.whiteTime]);
  
  const playerTime = useMemo(() => validColor === 'white' 
    ? game.current.timeControl.whiteTime 
    : game.current.timeControl.blackTime, [validColor, game.current.timeControl.whiteTime, game.current.timeControl.blackTime]);

  const movesDisplay = useMemo(() => 
    game.current.moves.map(move => move.san).join(', '),
    [game.current.moves]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.gameInfo}>Playing as {validColor} • {difficultyLabel} ({validDifficulty}) • {timeControlLabel}</Text>
      {game.current.moves.length > 0 && (
        <Text style={styles.lastMove}>
          Moves: {movesDisplay}
        </Text>
      )}
      <Text style={styles.moveTimer}>Move Timer: {moveTimer}s</Text>
      
      <View style={styles.boardContainer}>
        <PlayerInfo
          name="Computer"
          rating={computerRating}
          timeRemaining={timeControl !== 'timeless' ? opponentTime : undefined}
          moveTime={moveTimer}
          isActive={game.current.turn !== validColor}
          isOpponent={true}
          style={styles.opponentInfo}
        />
        
        <Chessboard
          fen={fen}
          onMove={onMove}
          size={300}
        />
        
        <PlayerInfo
          name={`${user.profile.name} (${validColor})`}
          rating={playerRating}
          timeRemaining={timeControl !== 'timeless' ? playerTime : undefined}
          moveTime={moveTimer}
          isActive={game.current.turn === validColor}
          isOpponent={false}
          style={styles.playerInfo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  gameInfo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  opponentInfo: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  playerInfo: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moveTimer: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6B35',
    marginBottom: 10,
  },
  lastMove: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
  },
});