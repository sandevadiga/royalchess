import { Chess } from 'chess.js';

export const pieceToIcon = (piece: string): string => {
  const icons: { [key: string]: string } = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
  };
  return icons[piece.toLowerCase()] || piece;
};

export const formatCapturedPieces = (pieces: string[]): string => {
  if (pieces.length === 0) return '-';
  const counts: { [key: string]: number } = {};
  pieces.forEach(p => counts[p] = (counts[p] || 0) + 1);
  return Object.entries(counts)
    .map(([piece, count]) => `${pieceToIcon(piece)}${count > 1 ? ` x${count}` : ''}`)
    .join(' ');
};

export const findKingInCheck = (chess: Chess): string | null => {
  if (!chess.inCheck()) return null;
  const board = chess.board();
  const turn = chess.turn();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.type === 'k' && piece.color === turn) {
        const fileChar = String.fromCharCode(97 + file);
        const rankChar = String(8 - rank);
        return fileChar + rankChar;
      }
    }
  }
  return null;
};

export const getBoardColorScheme = (scheme: string) => {
  const schemes = {
    classic: { white: '#f0d9b5', black: '#b58863' },
    blue: { white: '#dee3e6', black: '#8ca2ad' },
    green: { white: '#ffffdd', black: '#86a666' },
    purple: { white: '#e8d5f0', black: '#9f7ab8' },
    wood: { white: '#f4e4c1', black: '#a67c52' },
  };
  return schemes[scheme as keyof typeof schemes] || schemes.classic;
};
