import { View, Text, StyleSheet, Alert, BackHandler, Platform } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'react-native-chessboard';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
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
  
  const navigation = useNavigation();
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [moveTimer, setMoveTimer] = useState(30);
  const [gameEnded, setGameEnded] = useState(false);
  
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
          
          if (currentTime <= 0) {
            const result = currentPlayer === validColor ? 'loss' : 'win';
            handleGameEnd(result);
            return;
          }
          
          dispatch(updateTimer({ 
            player: currentPlayer, 
            time: currentTime - 1 
          }));
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeControl, game.current.status, validColor, handleGameEnd, dispatch]);
  

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

  useEffect(() => {
    const currentTurn = chess.turn();
    const playerTurn = validColor === 'white' ? 'w' : 'b';
    const isComputerTurn = currentTurn !== playerTurn;
    
    console.log('Computer move check:', {
      status: game.current.status,
      currentTurn,
      playerTurn,
      isComputerTurn,
      fen
    });
    
    if (game.current.status === 'playing' && isComputerTurn && !gameEnded) {
      console.log('Computer should move now!');
      const timeout = setTimeout(() => {
        console.log('Computer making move...');
        const moves = chess.moves({ verbose: true });
        console.log('Available moves:', moves.length);
        
        if (moves.length > 0) {
          const randomMove = moves[Math.floor(Math.random() * moves.length)];
          console.log('Selected move:', randomMove);
          const move = chess.move(randomMove);
          
          if (move) {
            console.log('Move executed:', move.san);
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
            
            if (chess.isCheckmate()) {
              handleGameEnd('loss');
            } else if (chess.isStalemate() || chess.isDraw()) {
              handleGameEnd('draw');
            }
          }
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [fen, game.current.status, validColor, chess, dispatch, handleGameEnd, gameEnded]);

  const onMove = useCallback((moveData: any) => {
    if (chess.turn() !== validColor.charAt(0)) return;
    
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
        
        if (chess.isCheckmate()) {
          handleGameEnd('win');
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
          key={fen}
          fen={fen}
          onMove={onMove}
          size={300}
          gestureEnabled={chess.turn() === validColor.charAt(0)}
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