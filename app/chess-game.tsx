import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../services/hooks';
import { makeMove, updateGameState, startNewGame, updateTimer } from '../services/game/gameSlice';

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
        <View style={styles.opponentInfo}>
          <View style={[styles.avatar, game.current.turn !== validColor && styles.activeTurn]}>
            <Text style={styles.avatarText}>C</Text>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.ratingLabel}>Computer</Text>
            <Text style={styles.ratingValue}>{computerRating}</Text>
            {timeControl !== 'timeless' && (
              <Text style={styles.timeRemaining}>
                {Math.floor((validColor === 'white' ? game.current.timeControl.blackTime : game.current.timeControl.whiteTime) / 60)}:
                {String((validColor === 'white' ? game.current.timeControl.blackTime : game.current.timeControl.whiteTime) % 60).padStart(2, '0')}
              </Text>
            )}
            <Text style={styles.moveTime}>Move: {moveTimer}s</Text>
          </View>
        </View>
        
        <Chessboard
          fen={fen}
          onMove={onMove}
          size={300}
        />
        
        <View style={styles.playerInfo}>
          <View style={[styles.avatar, game.current.turn === validColor && styles.activeTurn]}>
            <Text style={styles.avatarText}>
              {user.profile.name && user.profile.name.length > 0 ? user.profile.name.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.ratingLabel}>{user.profile.name} ({validColor})</Text>
            <Text style={styles.ratingValue}>{playerRating}</Text>
            {timeControl !== 'timeless' && (
              <Text style={styles.timeRemaining}>
                {Math.floor((validColor === 'white' ? game.current.timeControl.whiteTime : game.current.timeControl.blackTime) / 60)}:
                {String((validColor === 'white' ? game.current.timeControl.whiteTime : game.current.timeControl.blackTime) % 60).padStart(2, '0')}
              </Text>
            )}
            <Text style={styles.moveTime}>Move: {moveTimer}s</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%',
  },
  playerInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  playerDetails: {
    alignItems: 'flex-start',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTurn: {
    borderWidth: 3,
    borderColor: '#FF0000',
  },
  moveTimer: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6B35',
    marginBottom: 10,
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  moveTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginTop: 5,
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