# 🌐 API Layer

## Purpose
Centralized API layer for all backend communication.

## Structure

```
services/api/
├── client.ts      → HTTP client (fetch wrapper)
├── endpoints.ts   → All API endpoints
├── types.ts       → TypeScript types
├── index.ts       → Exports
└── README.md      → This file
```

## Files

### **client.ts**
HTTP client with:
- ✅ Fetch wrapper
- ✅ Auth token management
- ✅ Request timeout
- ✅ Error handling
- ✅ Retry logic ready

### **endpoints.ts**
All API endpoints organized by feature:
- Auth (login, register, logout)
- User (profile, stats, history)
- Game (create, move, resign)
- Multiplayer (matchmaking, chat)
- Leaderboard (global, country, friends)
- Puzzle (daily, random, solve)
- News (latest, article)

### **types.ts**
TypeScript interfaces for:
- Request payloads
- Response data
- API responses

## Usage

### Basic Example
```typescript
import { api, apiClient } from '../services/api';

// Login
const response = await api.auth.login({
  email: 'user@example.com',
  password: 'password123',
});

if (response.success) {
  apiClient.setToken(response.data.token);
  console.log('Logged in:', response.data.user);
} else {
  console.error('Error:', response.error);
}
```

### With Redux
```typescript
import { api } from '../services/api';
import { login } from '../services/user/userSlice';

// In async thunk
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginRequest) => {
    const response = await api.auth.login(credentials);
    
    if (response.success) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.error);
  }
);
```

### Error Handling
```typescript
const response = await api.game.createGame({
  playerColor: 'white',
  timeControl: 'blitz',
  opponentType: 'computer',
});

if (response.success) {
  // Handle success
  console.log('Game created:', response.data);
} else {
  // Handle error
  console.error('Failed:', response.error);
}
```

## API Endpoints

### Auth
```typescript
api.auth.login({ email, password })
api.auth.register({ name, email, password })
api.auth.logout()
api.auth.refreshToken(refreshToken)
```

### User
```typescript
api.user.getProfile()
api.user.updateProfile(data)
api.user.getStats()
api.user.getGameHistory()
```

### Game
```typescript
api.game.createGame({ playerColor, timeControl, opponentType })
api.game.getGame(gameId)
api.game.makeMove({ gameId, from, to, promotion })
api.game.resignGame(gameId)
api.game.offerDraw(gameId)
```

### Multiplayer
```typescript
api.multiplayer.findMatch({ timeControl, ratingRange })
api.multiplayer.cancelMatchmaking()
api.multiplayer.sendMessage(gameId, message)
api.multiplayer.inviteFriend(friendId, settings)
```

### Leaderboard
```typescript
api.leaderboard.getGlobal(limit)
api.leaderboard.getByCountry(country, limit)
api.leaderboard.getFriends()
```

### Puzzle
```typescript
api.puzzle.getDailyPuzzle()
api.puzzle.getRandomPuzzle(rating)
api.puzzle.submitSolution(puzzleId, moves)
```

### News
```typescript
api.news.getLatest(limit)
api.news.getArticle(articleId)
```

## Configuration

### Change API URL
```typescript
// services/api/client.ts
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'      // Development
  : 'https://api.royalchess.com';    // Production
```

### Change Timeout
```typescript
const API_TIMEOUT = 10000; // 10 seconds
```

## Features

✅ **Type-safe** - Full TypeScript support  
✅ **Error handling** - Consistent error responses  
✅ **Auth management** - Token handling built-in  
✅ **Timeout** - Prevents hanging requests  
✅ **Organized** - Endpoints grouped by feature  
✅ **Scalable** - Easy to add new endpoints  

## Adding New Endpoints

### 1. Add types (types.ts)
```typescript
export interface NewFeatureRequest {
  data: string;
}

export interface NewFeatureResponse {
  result: string;
}
```

### 2. Add endpoint (endpoints.ts)
```typescript
export const newFeatureApi = {
  doSomething: (data: NewFeatureRequest): Promise<ApiResponse<NewFeatureResponse>> => {
    return apiClient.post('/new-feature', data);
  },
};
```

### 3. Export (endpoints.ts)
```typescript
export default {
  // ... existing
  newFeature: newFeatureApi,
};
```

### 4. Use it
```typescript
import { api } from '../services/api';

const response = await api.newFeature.doSomething({ data: 'test' });
```

## Best Practices

1. **Always check response.success**
```typescript
if (response.success) {
  // Use response.data
} else {
  // Handle response.error
}
```

2. **Set token after login**
```typescript
apiClient.setToken(token);
```

3. **Clear token on logout**
```typescript
apiClient.setToken(null);
```

4. **Use TypeScript types**
```typescript
const response: ApiResponse<LoginResponse> = await api.auth.login(data);
```

5. **Handle errors gracefully**
```typescript
try {
  const response = await api.user.getProfile();
  if (!response.success) {
    showError(response.error);
  }
} catch (error) {
  showError('Network error');
}
```

## Integration with Redux

```typescript
// userSlice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, apiClient } from '../api';

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    const response = await api.auth.login(credentials);
    
    if (response.success) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    
    return rejectWithValue(response.error);
  }
);
```

## Testing

```typescript
// Mock API client
jest.mock('../services/api/client');

// Test endpoint
test('login success', async () => {
  const mockResponse = {
    success: true,
    data: { token: 'abc123', user: { id: '1' } },
  };
  
  apiClient.post.mockResolvedValue(mockResponse);
  
  const result = await api.auth.login({ email: 'test@test.com', password: 'pass' });
  
  expect(result.success).toBe(true);
  expect(result.data.token).toBe('abc123');
});
```

## Status

✅ **Client** - Complete  
✅ **Endpoints** - Complete (7 categories)  
✅ **Types** - Complete  
✅ **Documentation** - Complete  
⏳ **Backend** - Not implemented yet  

**Ready for backend integration!**

**Last Updated:** After creating API layer
