import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Chessboard from 'react-native-chessboard';
import AdBanner from '../components/common/AdBanner';
import PlayerInfo from '../components/game/PlayerInfo';
import { endGame } from '../services/game/gameSlice';
import { useGameEngine } from '../services/game/useGameEngine';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { adjustComputerDifficulty, updateStatistics } from '../services/user/userSlice';
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
  const gameEngineProps = useMemo(() => ({
    playerColor: validatedColor as 'white' | 'black',
    difficulty: validDifficulty,
    timeControl: timeControl as TimeControlType
  }), [validatedColor, validDifficulty, timeControl]);
  
  const { fen, chess, gameEnded, capturedPieces, onPlayerMove, lastMove } = useGameEngine(gameEngineProps);
  const [boardSize, setBoardSize] = useState(0);

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

  const opponentTime = validatedColor === 'white'
    ? game.current.timeControl.blackTime
    : game.current.timeControl.whiteTime;

  const playerTime = validatedColor === 'white'
    ? game.current.timeControl.whiteTime
    : game.current.timeControl.blackTime;

  const lastMoves = useMemo(() => {
    const moves = game.current.moves;
    return moves.slice(-10).map((move, idx) => ({
      number: moves.length - 9 + idx,
      san: move.san
    }));
  }, [game.current.moves]);

  const pieceToIcon = (piece: string) => {
    const icons: { [key: string]: string } = {
      'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
    };
    return icons[piece.toLowerCase()] || piece;
  };

  const formatCapturedPieces = (pieces: string[]) => {
    if (pieces.length === 0) return '-';
    const counts: { [key: string]: number } = {};
    pieces.forEach(p => counts[p] = (counts[p] || 0) + 1);
    return Object.entries(counts)
      .map(([piece, count]) => `${pieceToIcon(piece)}${count > 1 ? ` x${count}` : ''}`)
      .join(' ');
  };

  const boardColors = useMemo(() => {
    const schemes = {
      classic: { white: '#f0d9b5', black: '#b58863' },
      blue: { white: '#dee3e6', black: '#8ca2ad' },
      green: { white: '#ffffdd', black: '#86a666' },
      purple: { white: '#e8d5f0', black: '#9f7ab8' },
      wood: { white: '#f4e4c1', black: '#a67c52' },
    };
    const scheme = user.preferences.boardColorScheme as keyof typeof schemes;
    return schemes[scheme] || schemes.classic;
  }, [user.preferences.boardColorScheme]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <AdBanner />

      <PlayerInfo
        name="Computer"
        rating={computerRating}
        timeRemaining={timeControl !== 'timeless' ? opponentTime : undefined}
        isActive={game.current.turn !== validatedColor}
        isOpponent={true}
        capturedPieces={formatCapturedPieces(capturedPieces.black)}
      />


      <View onLayout={(e) => setBoardSize(e.nativeEvent.layout.width)}>
        <Chessboard
          key={fen}
          fen={fen}
          onMove={(move) => onPlayerMove(move.move)}
          gestureEnabled={chess.turn() === validatedColor.charAt(0)}
          colors={boardColors}
          durations={{ move: 200 }}
        />
        {lastMove && boardSize > 0 && (
          <View style={styles.highlightContainer} pointerEvents="none">
            {['from', 'to'].map((type) => {
              const square = lastMove[type as 'from' | 'to'];
              const file = square.charCodeAt(0) - 97;
              const rank = 8 - parseInt(square[1]);
              const squareSize = boardSize / 8;
              return (
                <View
                  key={type}
                  style={[
                    styles.highlight,
                    {
                      left: file * squareSize,
                      top: rank * squareSize,
                      width: squareSize,
                      height: squareSize,
                    }
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>


      <PlayerInfo
        name={user.profile.name}
        rating={playerRating}
        timeRemaining={timeControl !== 'timeless' ? playerTime : undefined}
        isActive={game.current.turn === validatedColor}
        isOpponent={false}
        capturedPieces={formatCapturedPieces(capturedPieces.white)}
      />
      <AdBanner />

      {game.current.moves.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movesScroll}>
          {lastMoves.map((move, idx) => (
            <View key={idx} style={styles.moveChip}>
              <Text style={styles.moveText}>{move.number}.{move.san}</Text>
            </View>
          ))}
        </ScrollView>
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


  movesScroll: {
    width: '100%',
    marginTop: 6,
    maxHeight: 30,
  },
  moveChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  moveText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
  },
  highlightContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 0, 0.4)',
  },
});