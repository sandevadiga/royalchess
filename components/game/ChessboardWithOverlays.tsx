import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Chessboard from 'react-native-chessboard';

interface ChessboardWithOverlaysProps {
  fen: string;
  onMove: (move: string) => void;
  gestureEnabled: boolean;
  colors: { white: string; black: string };
  lastMove?: { from: string; to: string } | null;
  kingInCheck?: string | null;
}

export const ChessboardWithOverlays = React.memo<ChessboardWithOverlaysProps>(({
  fen,
  onMove,
  gestureEnabled,
  colors,
  lastMove,
  kingInCheck
}) => {
  const [boardSize, setBoardSize] = useState(0);

  return (
    <View onLayout={(e) => setBoardSize(e.nativeEvent.layout.width)}>
      <Chessboard
        key={fen}
        fen={fen}
        onMove={(move) => onMove(move.move)}
        gestureEnabled={gestureEnabled}
        colors={colors}
        durations={{ move: 200 }}
      />
      {boardSize > 0 && (
        <View style={styles.highlightContainer} pointerEvents="none">
          {lastMove && ['from', 'to'].map((type) => {
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
          {kingInCheck && (
            <View
              style={[
                styles.checkHighlight,
                {
                  left: (kingInCheck.charCodeAt(0) - 97) * (boardSize / 8),
                  top: (8 - parseInt(kingInCheck[1])) * (boardSize / 8),
                  width: boardSize / 8,
                  height: boardSize / 8,
                }
              ]}
            />
          )}
        </View>
      )}
    </View>
  );
});

ChessboardWithOverlays.displayName = 'ChessboardWithOverlays';

const styles = StyleSheet.create({
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
  checkHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
});
