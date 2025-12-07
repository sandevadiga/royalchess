import { apiClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  CreateGameRequest,
  GameResponse,
  MakeMoveRequest,
  MatchmakingRequest,
  MatchResponse,
  LeaderboardEntry,
  PuzzleResponse,
  ApiResponse,
} from './types';

// Auth Endpoints
export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/login', data);
  },

  register: (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/register', data);
  },

  logout: (): Promise<ApiResponse> => {
    return apiClient.post('/auth/logout');
  },

  refreshToken: (refreshToken: string): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },
};

// User Endpoints
export const userApi = {
  getProfile: (): Promise<ApiResponse<any>> => {
    return apiClient.get('/user/profile');
  },

  updateProfile: (data: any): Promise<ApiResponse<any>> => {
    return apiClient.put('/user/profile', data);
  },

  getStats: (): Promise<ApiResponse<any>> => {
    return apiClient.get('/user/stats');
  },

  getGameHistory: (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/user/games');
  },
};

// Game Endpoints
export const gameApi = {
  createGame: (data: CreateGameRequest): Promise<ApiResponse<GameResponse>> => {
    return apiClient.post('/games', data);
  },

  getGame: (gameId: string): Promise<ApiResponse<GameResponse>> => {
    return apiClient.get(`/games/${gameId}`);
  },

  makeMove: (data: MakeMoveRequest): Promise<ApiResponse<GameResponse>> => {
    return apiClient.post(`/games/${data.gameId}/move`, data);
  },

  resignGame: (gameId: string): Promise<ApiResponse> => {
    return apiClient.post(`/games/${gameId}/resign`);
  },

  offerDraw: (gameId: string): Promise<ApiResponse> => {
    return apiClient.post(`/games/${gameId}/draw`);
  },
};

// Multiplayer Endpoints
export const multiplayerApi = {
  findMatch: (data: MatchmakingRequest): Promise<ApiResponse<MatchResponse>> => {
    return apiClient.post('/multiplayer/matchmaking', data);
  },

  cancelMatchmaking: (): Promise<ApiResponse> => {
    return apiClient.delete('/multiplayer/matchmaking');
  },

  sendMessage: (gameId: string, message: string): Promise<ApiResponse> => {
    return apiClient.post(`/multiplayer/${gameId}/chat`, { message });
  },

  inviteFriend: (friendId: string, gameSettings: any): Promise<ApiResponse> => {
    return apiClient.post('/multiplayer/invite', { friendId, gameSettings });
  },
};

// Leaderboard Endpoints
export const leaderboardApi = {
  getGlobal: (limit = 100): Promise<ApiResponse<LeaderboardEntry[]>> => {
    return apiClient.get(`/leaderboard?limit=${limit}`);
  },

  getByCountry: (country: string, limit = 100): Promise<ApiResponse<LeaderboardEntry[]>> => {
    return apiClient.get(`/leaderboard/country/${country}?limit=${limit}`);
  },

  getFriends: (): Promise<ApiResponse<LeaderboardEntry[]>> => {
    return apiClient.get('/leaderboard/friends');
  },
};

// Puzzle Endpoints
export const puzzleApi = {
  getDailyPuzzle: (): Promise<ApiResponse<PuzzleResponse>> => {
    return apiClient.get('/puzzles/daily');
  },

  getRandomPuzzle: (rating?: number): Promise<ApiResponse<PuzzleResponse>> => {
    const query = rating ? `?rating=${rating}` : '';
    return apiClient.get(`/puzzles/random${query}`);
  },

  submitSolution: (puzzleId: string, moves: string[]): Promise<ApiResponse<{ correct: boolean }>> => {
    return apiClient.post(`/puzzles/${puzzleId}/solve`, { moves });
  },
};

// News Endpoints
export const newsApi = {
  getLatest: (limit = 10): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/news?limit=${limit}`);
  },

  getArticle: (articleId: string): Promise<ApiResponse<any>> => {
    return apiClient.get(`/news/${articleId}`);
  },
};

// Export all APIs
export default {
  auth: authApi,
  user: userApi,
  game: gameApi,
  multiplayer: multiplayerApi,
  leaderboard: leaderboardApi,
  puzzle: puzzleApi,
  news: newsApi,
};
