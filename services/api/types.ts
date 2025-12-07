// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    rating: number;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Game API Types
export interface CreateGameRequest {
  playerColor: 'white' | 'black';
  timeControl: string;
  opponentType: 'computer' | 'human';
  difficulty?: number;
}

export interface GameResponse {
  id: string;
  fen: string;
  pgn: string;
  status: string;
  players: {
    white: string;
    black: string;
  };
}

export interface MakeMoveRequest {
  gameId: string;
  from: string;
  to: string;
  promotion?: string;
}

// Multiplayer API Types
export interface MatchmakingRequest {
  timeControl: string;
  ratingRange: [number, number];
}

export interface MatchResponse {
  matchId: string;
  opponent: {
    id: string;
    name: string;
    rating: number;
  };
  gameId: string;
}

// Leaderboard API Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
}

// Puzzle API Types
export interface PuzzleResponse {
  id: string;
  fen: string;
  solution: string[];
  rating: number;
  themes: string[];
}
