import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '../services/hooks';

export default function ChessGameScreen() {
  const params = useLocalSearchParams();
  const color = params.color || 'white';
  const difficulty = params.difficulty || '3';
  
  // Validate parameters
  const validColor = ['white', 'black'].includes(color as string) ? color : 'white';
  const validDifficulty = Math.max(1, Math.min(5, Number(difficulty) || 3));
  
  // Get user data from Redux
  const user = useAppSelector(state => state.user);
  
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [playerRating] = useState(user.rating.current);
  const [computerRating] = useState(1000 + (validDifficulty - 1) * 200);

  const onMove = (moveData: any) => {
    try {
      const move = game.move(moveData.move);
      if (move) {
        setFen(game.fen());
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
      <Text style={styles.gameInfo}>Playing as {validColor} • {getDifficultyLabel()}</Text>
      
      <View style={styles.boardContainer}>
        <View style={styles.opponentInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>C</Text>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.ratingLabel}>Computer</Text>
            <Text style={styles.ratingValue}>{computerRating}</Text>
          </View>
        </View>
        
        <Chessboard
          fen={fen}
          onMove={onMove}
          size={300}
        />
        
        <View style={styles.playerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.profile.name && user.profile.name.length > 0 ? user.profile.name.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.ratingLabel}>{user.profile.name} ({validColor})</Text>
            <Text style={styles.ratingValue}>{playerRating}</Text>
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
});