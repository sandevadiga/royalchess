import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import AdBanner from '../components/common/AdBanner';
import { ChessboardWithOverlays } from '../components/game/ChessboardWithOverlays';
import { MoveChip } from '../components/game/MoveChip';
import PlayerInfo from '../components/game/PlayerInfo';
import { endGame } from '../services/game/gameSlice';
import { useGameEngine } from '../services/game/useGameEngine';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { adjustComputerDifficulty, updateStatistics } from '../services/user/userSlice';
import { findKingInCheck, formatCapturedPieces, getBoardColorScheme } from '../utils/chessHelpers';
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
  const scrollViewRef = useRef<ScrollView>(null);

  const kingInCheck = useMemo(() => findKingInCheck(chess), [fen]);

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
    return moves.slice(-10).map((move, idx) => {
      const moveIndex = moves.length - 10 + idx;
      return {
        number: Math.floor(moveIndex / 2) + 1,
        san: move.san,
        color: (moveIndex % 2 === 0 ? 'w' : 'b') as 'w' | 'b'
      };
    });
  }, [game.current.moves]);

  useEffect(() => {
    if (scrollViewRef.current && game.current.moves.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [game.current.moves.length]);

  const boardColors = useMemo(() =>
    getBoardColorScheme(user.preferences.boardColorScheme),
    [user.preferences.boardColorScheme]
  );

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


      <ChessboardWithOverlays
        fen={fen}
        onMove={onPlayerMove}
        gestureEnabled={chess.turn() === validatedColor.charAt(0)}
        colors={boardColors}
        lastMove={lastMove}
        kingInCheck={kingInCheck}
      />


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
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.movesScroll}
        >
          {lastMoves.map((move, idx) => (
            <MoveChip
              key={idx}
              moveNumber={move.number}
              san={move.san}
              color={move.color}
            />
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
});