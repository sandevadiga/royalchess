import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../services/hooks';
import { makeMove, updateGameState, startNewGame, updateTimer } from '../services/game/gameSlice';
import PlayerInfo from '../components/game/PlayerInfo';

export default function ChessGameScreen() {
  const params = useLocalSearchParams();
  const color = params.color || 'white';
  const difficulty = params.difficulty || '3';
  const timeControl = params.timeControl || 'blitz';
  
  // Validate parameters
  const validColor = ['white', 'black'].includes(color as string) ? color : 'white';
  const validDifficulty = Math.max(1, Math.min(5, Number(difficulty) || 3));
  
  const getTimeControlLabel = () => {
    const labels = {
      blitz: 'Blitz 5min',
      rapid: 'Rapid 10min', 
      classical: 'Classical 30min',
      timeless: 'Timeless'
    };
    return labels[timeControl as keyof typeof labels] || 'Blitz 5min';
  };
  
  // Get user data from Redux
  const user = useAppSelector(state => state.user);
  const game = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [moveTimer, setMoveTimer] = useState(30);
  useEffect(() => {
    dispatch(startNewGame({
      playerColor: validColor as 'white' | 'black',
      difficulty: validDifficulty as 1 | 2 | 3 | 4 | 5,
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
  

  const [playerRating] = useState(user.rating.current);
  const [computerRating] = useState(1000 + (validDifficulty - 1) * 200);

  const onMove = (moveData: any) => {
    try {
      const move = chess.move(moveData.move);
      if (move) {
        const newFen = chess.fen();
        setFen(newFen);
        
        // Dispatch to Redux
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
        
        // Reset move timer for timeless games
        if (timeControl === 'timeless') {
          setMoveTimer(30);
        }
      }
    } catch (error) {
      console.log('Invalid move:', error);
    }
  };

  const getDifficultyLabel = () => {
    const labels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[validDifficulty - 1] || 'Medium';
  };

  const opponentTime = validColor === 'white' 
    ? game.current.timeControl.blackTime 
    : game.current.timeControl.whiteTime;
  
  const playerTime = validColor === 'white' 
    ? game.current.timeControl.whiteTime 
    : game.current.timeControl.blackTime;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Game vs Computer</Text>
      <Text style={styles.gameInfo}>Playing as {validColor} • {getDifficultyLabel()} • {getTimeControlLabel()}</Text>
      {game.current.moves.length > 0 && (
        <Text style={styles.lastMove}>
          Moves: {game.current.moves.map(move => move.san).join(', ')}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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