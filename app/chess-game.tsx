import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useEffect, useCallback, useMemo } from 'react';
import Chessboard from 'react-native-chessboard';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../services/hooks';
import { endGame } from '../services/game/gameSlice';
import { adjustComputerDifficulty, updateStatistics } from '../services/user/userSlice';
import PlayerInfo from '../components/game/PlayerInfo';
import { useGameEngine } from '../services/game/useGameEngine';
import { getDifficultyLabel } from '../utils/computerAI';
import { TimeControlType } from '../utils/gameRules';

export default function ChessGameScreen() {
  const params = useLocalSearchParams();
  const color = params.color || 'white';
  const difficulty = params.difficulty;
  const timeControl = params.timeControl || 'blitz';
  
  // Validate parameters
  const validColor = (Array.isArray(color) ? color[0] : color) as string;
  const validatedColor = ['white', 'black'].includes(validColor) ? validColor : 'white';
  
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
  const finalDifficulty = difficulty ? Number(difficulty) : (user.computerDifficulty || 1200);
  const validDifficulty = Math.max(800, Math.min(2400, finalDifficulty));
  
  const navigation = useNavigation();
  
  // Use game engine hook
  const { fen, chess, gameEnded, capturedPieces, onPlayerMove } = useGameEngine({
    playerColor: validatedColor as 'white' | 'black',
    difficulty: validDifficulty,
    timeControl: timeControl as TimeControlType
  });
  
  // Handle game end
  useEffect(() => {
    if (gameEnded && game.current.status !== 'playing') {
      const getTitle = () => {
        if (game.current.status === 'checkmate') return 'Checkmate!';
        if (game.current.status === 'stalemate') return 'Stalemate!';
        if (game.current.status === 'timeout') return 'Time Out!';
        if (game.current.status === 'resigned') return 'Game Resigned';
        return 'Game Over';
      };
      
      const getMessage = () => {
        const lastMove = game.current.moves[game.current.moves.length - 1];
        if (game.current.status === 'checkmate') {
          return lastMove ? `You ${lastMove.piece === 'k' ? 'lost' : 'won'} by checkmate!` : 'Game ended by checkmate';
        }
        if (game.current.status === 'timeout') return 'Time expired!';
        if (game.current.status === 'stalemate') return 'Draw by stalemate';
        return 'Game has ended';
      };
      
      setTimeout(() => {
        Alert.alert(
          getTitle(),
          getMessage(),
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 500);
    }
  }, [gameEnded, game.current.status, navigation]);
  
  // Handle quit
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (gameEnded) return;
      e.preventDefault();
      Alert.alert(
        'Quit Game',
        'Do you want to quit? This will count as a loss.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Quit', 
            style: 'destructive',
            onPress: () => {
              dispatch(endGame({ status: 'resigned', result: 'loss' }));
              dispatch(updateStatistics('loss'));
              dispatch(adjustComputerDifficulty('loss'));
              navigation.dispatch(e.data.action);
            }
          }
        ]
      );
    });
    return unsubscribe;
  }, [navigation, gameEnded, dispatch]);

  const playerRating = useMemo(() => user.rating.current, [user.rating.current]);
  const computerRating = useMemo(() => validDifficulty, [validDifficulty]);
  const difficultyLabel = useMemo(() => getDifficultyLabel(validDifficulty), [validDifficulty]);

  const opponentTime = useMemo(() => validatedColor === 'white' 
    ? game.current.timeControl.blackTime 
    : game.current.timeControl.whiteTime, [validatedColor, game.current.timeControl.blackTime, game.current.timeControl.whiteTime]);
  
  const playerTime = useMemo(() => validatedColor === 'white' 
    ? game.current.timeControl.whiteTime 
    : game.current.timeControl.blackTime, [validatedColor, game.current.timeControl.whiteTime, game.current.timeControl.blackTime]);

  const movesDisplay = useMemo(() => 
    game.current.moves.map(move => move.san).join(', '),
    [game.current.moves]
  );
  
  const pieceToIcon = (piece: string) => {
    const icons: {[key: string]: string} = {
      'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
    };
    return icons[piece.toLowerCase()] || piece;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.gameInfo}>{validatedColor} • {difficultyLabel} ({validDifficulty}) • {timeControlLabel}</Text>
      
      <View style={styles.capturedRow}>
        <View style={styles.capturedBox}>
          <Text style={styles.capturedLabel}>You</Text>
          <Text style={styles.capturedPieces}>{capturedPieces.white.map(pieceToIcon).join(' ') || '-'}</Text>
        </View>
        <View style={styles.capturedBox}>
          <Text style={styles.capturedLabel}>Computer</Text>
          <Text style={styles.capturedPieces}>{capturedPieces.black.map(pieceToIcon).join(' ') || '-'}</Text>
        </View>
      </View>
      
      <PlayerInfo
        name="Computer"
        rating={computerRating}
        timeRemaining={timeControl !== 'timeless' ? opponentTime : undefined}
        isActive={game.current.turn !== validatedColor}
        isOpponent={true}
      />
      
      <Chessboard
        key={fen}
        fen={fen}
        onMove={(move) => onPlayerMove(move.move)}
        gestureEnabled={chess.turn() === validatedColor.charAt(0)}
      />
      
      <PlayerInfo
        name={user.profile.name}
        rating={playerRating}
        timeRemaining={timeControl !== 'timeless' ? playerTime : undefined}
        isActive={game.current.turn === validatedColor}
        isOpponent={false}
      />
      
      {game.current.moves.length > 0 && (
        <Text style={styles.lastMove}>{movesDisplay}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 12,
    alignItems: 'center',
  },
  gameInfo: {
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
    marginBottom: 4,
  },

  capturedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  capturedBox: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  capturedLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  capturedPieces: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMove: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    marginTop: 8,
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 5,
    width: '100%',
  },
});