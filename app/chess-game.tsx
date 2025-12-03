import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';

export default function ChessGameScreen() {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [playerRating, setPlayerRating] = useState(1200);
  const [computerRating] = useState(1000);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Game vs Computer</Text>
      <View style={styles.boardContainer}>
        <Chessboard
          fen={fen}
          onMove={onMove}
          size={300}
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
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  playerRating: {
    alignItems: 'center',
  },
  computerRating: {
    alignItems: 'center',
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
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});