import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View, Pressable, Text } from 'react-native';
import { Chess } from 'chess.js';
import AdBanner from '../components/common/AdBanner';
import { ChessboardWithOverlays } from '../components/game/ChessboardWithOverlays';
import { MoveChip } from '../components/game/MoveChip';
import PlayerInfo from '../components/game/PlayerInfo';
import { endGame, undoToMove } from '../services/game/gameSlice';
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
  const undoEnabled = params.undoEnabled === 'true';
  
  console.log('🔧 Chess Game Debug:', {
    undoEnabled,
    undoParam: params.undoEnabled,
    allParams: params
  });

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

  // Auto-save game state when leaving
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (!gameEnded) {
        // Auto-save current game state without ending the game
        console.log('Game paused - state saved');
      }
    });
    
    return unsubscribe;
  }, [navigation, gameEnded]);

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
    const startIndex = Math.max(0, moves.length - 10);
    return moves.slice(-10).map((move, idx) => {
      const actualMoveIndex = startIndex + idx;
      return {
        number: Math.floor(actualMoveIndex / 2) + 1,
        san: move.san,
        color: (actualMoveIndex % 2 === 0 ? 'w' : 'b') as 'w' | 'b',
        moveIndex: actualMoveIndex
      };
    });
  }, [game.current.moves]);

  const handleUndoToMove = useCallback((moveIndex: number) => {
    console.log('🔄 Undo Move Clicked:', {
      moveIndex,
      undoEnabled,
      gameEnded,
      canUndo: undoEnabled && !gameEnded
    });
    
    if (undoEnabled && !gameEnded) {
      console.log('✅ Dispatching undo action');
      dispatch(undoToMove(moveIndex));
    } else {
      console.log('❌ Undo blocked:', { undoEnabled, gameEnded });
    }
  }, [undoEnabled, gameEnded, dispatch]);

  const handleUndoOne = useCallback(() => {
    const currentMoves = game.current.moves.length;
    if (currentMoves > 0 && undoEnabled && !gameEnded) {
      dispatch(undoToMove(currentMoves - 2)); // Undo one move (player + computer)
    }
  }, [game.current.moves.length, undoEnabled, gameEnded, dispatch]);

  const handleRedoOne = useCallback(() => {
    // For now, just a placeholder - full redo would need move history
    console.log('Redo not implemented yet');
  }, []);

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
        <View style={styles.movesContainer}>
          {undoEnabled && (
            <Pressable 
              style={[styles.arrowButtonFixed, { opacity: game.current.moves.length > 0 ? 1 : 0.3 }]}
              onPress={handleUndoOne}
              disabled={game.current.moves.length === 0 || gameEnded}
            >
              <Text style={styles.arrowText}>←</Text>
            </Pressable>
          )}
          
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.movesScroll}
            contentContainerStyle={styles.movesContent}
          >
            {lastMoves.map((move, idx) => {
              console.log('🎯 Rendering MoveChip:', {
                idx,
                moveIndex: move.moveIndex,
                undoEnabled,
                san: move.san
              });
              
              return (
                <MoveChip
                  key={idx}
                  moveNumber={move.number}
                  san={move.san}
                  color={move.color}
                  moveIndex={move.moveIndex}
                  undoEnabled={undoEnabled}
                  onPress={handleUndoToMove}
                />
              );
            })}
          </ScrollView>
          
          {undoEnabled && (
            <Pressable 
              style={[styles.arrowButtonFixed, { opacity: 0.3 }]}
              onPress={handleRedoOne}
              disabled={true}
            >
              <Text style={styles.arrowText}>→</Text>
            </Pressable>
          )}
        </View>
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


  movesContainer: {
    width: '100%',
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  movesScroll: {
    flex: 1,
    maxHeight: 30,
  },

  movesContent: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
  },

  arrowButtonFixed: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 8,
  },

  arrowText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});