# Royal Chess App - Agent Documentation

## App Overview
Professional chess application built with React Native, Expo Router, and Redux Toolkit. Designed for scalability with multiplayer support, theming system, and comprehensive state management.

## Architecture

### Redux Services (9 Services)
```
services/
├── user/         - Profile, ratings, statistics, preferences
├── game/         - Chess logic, moves, history, analysis
├── theme/        - Light/dark themes, board customization
├── language/     - Internationalization support
├── session/      - Auto-save, recovery, activity tracking
├── logs/         - Error tracking, analytics, debugging
├── sound/        - Audio settings, move sounds
├── multiplayer/  - Real-time connections, matchmaking
└── app/          - Navigation, network, UI state
```

### Theme System
```
common/styles/
├── themes/index.ts  - Light/dark theme definitions
├── sizes/index.ts   - Spacing, fonts, borders
└── createStyles.ts  - StyleSheet factory
```

## Key Features

### ✅ Implemented
- **Chess Game**: Working board with move validation (chess.js)
- **User Profile**: Name, rating, statistics, preferences
- **Theme System**: Light/dark mode with auto-switching
- **State Persistence**: Redux data saved to AsyncStorage
- **Tab Navigation**: Home, News, Puzzles, Profile
- **Game Setup**: Color selection, difficulty levels

### 🚧 Planned
- **Multiplayer**: Real-time online games
- **Puzzles**: Chess training exercises
- **News**: Chess updates and articles
- **Sound System**: Move sounds and music
- **Analytics**: Performance tracking

## Tech Stack
- **Frontend**: React Native + Expo Router
- **State**: Redux Toolkit + Redux Persist
- **Chess Engine**: chess.js + react-native-chessboard
- **Styling**: Centralized theme system
- **Storage**: AsyncStorage for persistence
- **Navigation**: File-based routing

## File Structure
```
├── app/              - Screens and navigation
├── services/         - Redux state management
├── common/styles/    - Theme and styling system
├── assets/           - Images and resources
└── package.json      - Dependencies
```

## Usage

### Theme Usage
```typescript
import { useTheme } from '../common/styles/themes/useTheme';

const { theme } = useTheme();
// Use: theme.colors.background, theme.spacing.md
```

### Redux Usage
```typescript
import { useAppSelector, useAppDispatch } from '../services/hooks';

const user = useAppSelector(state => state.user);
const dispatch = useAppDispatch();
```

## Development Status
- **Current**: Basic chess game with profile management
- **Next**: Implement remaining services and multiplayer
- **Goal**: Production-ready chess platform