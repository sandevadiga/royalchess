# Utils - Game Logic Layer

Reusable game logic utilities for chess gameplay. Used by both computer and multiplayer games.

## 📁 Structure

```
utils/
├── gameRules.ts       → Chess rules, time controls, game end conditions
├── timerHandler.ts    → Timer countdown, increment logic
├── moveHandler.ts     → Move validation, execution, capture tracking
├── computerAI.ts      → Computer move generation
├── chessHelpers.ts    → Chess utility functions (NEW)
└── README.md
```

## 🎯 Purpose

**Pure functions** that handle game logic without side effects. Can be:
- ✅ Tested independently
- ✅ Reused across features
- ✅ Used in computer & multiplayer games

## 📚 Files

### **gameRules.ts**
Chess rules and time control configurations (Lichess standard).

```typescript
// Get time control
const config = getTimeControl('blitz'); // { initial: 300, increment: 0 }

// Check game end
const result = checkGameEnd(chess, 'white');
// { ended: true, status: 'checkmate', result: 'win' }

// Check timeout
const timeout = checkTimeout(0, 300, 'white');
// { timeout: true, result: 'loss' }
```

**Time Controls:**
- `blitz`: 5+0 (300 seconds)
- `rapid`: 10+0 (600 seconds)
- `classical`: 30+0 (1800 seconds)
- `timeless`: No time limit

---

### **timerHandler.ts**
Timer state management and countdown logic.

```typescript
// Decrement timer
const newState = decrementTimer(timerState);

// Add increment after move
const updated = addIncrement(timerState, 'white', 2);

// Switch turn
const switched = switchTurn(timerState);

// Check expiration
const expired = hasTimeExpired(timerState);
```

---

### **moveHandler.ts**
Move execution, validation, and capture tracking.

```typescript
// Execute move
const result = executeMove(chess, { from: 'e2', to: 'e4' });
// { success: true, move: {...}, fen: '...', pgn: '...' }

// Get legal moves
const moves = getLegalMoves(chess);

// Get captured pieces
const captured = getCapturedPieces(moves);
// { white: ['p', 'n'], black: ['p'] }
```

---

### **computerAI.ts**
Computer move generation based on difficulty.

```typescript
// Generate move
const move = generateComputerMove(chess, 1200);

// Get difficulty label
const label = getDifficultyLabel(1200); // 'Intermediate'
```

**Difficulty Levels (ELO):**
- `< 1000`: Beginner
- `1000-1399`: Intermediate
- `1400-1799`: Advanced
- `1800-2199`: Expert
- `≥ 2200`: Master

---

### **chessHelpers.ts** ⭐ NEW
Chess display and board utilities.

```typescript
// Convert piece to icon
const icon = pieceToIcon('q'); // '♛'

// Format captured pieces
const captured = formatCapturedPieces(['p', 'p', 'n']);
// '♟ x2 ♞'

// Find king in check
const kingSquare = findKingInCheck(chess); // 'e8'

// Get board color scheme
const colors = getBoardColorScheme('blue');
// { white: '#dee3e6', black: '#8ca2ad' }
```

**Functions:**
- `pieceToIcon(piece)` - Piece notation to Unicode icon
- `formatCapturedPieces(pieces)` - Format with counts
- `findKingInCheck(chess)` - Find checked king position
- `getBoardColorScheme(scheme)` - Get board colors

---

## 🔄 Usage Flow

```
Component (chess-game.tsx)
    ↓
Custom Hook (useGameEngine)
    ↓
Game Engine (gameEngine.ts)
    ↓
Utils (gameRules, timerHandler, moveHandler, computerAI)
    ↓
Redux (gameSlice, userSlice)
```

---

## ✨ Benefits

1. **Reusable** - Same logic for computer & multiplayer
2. **Testable** - Pure functions, easy to unit test
3. **Maintainable** - Clear separation of concerns
4. **Scalable** - Easy to add new features

---

## 🚀 Future Enhancements

- [ ] Stockfish integration for stronger AI
- [ ] Opening book for computer moves
- [ ] Move validation with chess rules
- [ ] Time pressure handling
- [ ] Premove support

---

**Last Updated:** After Lichess-style implementation
