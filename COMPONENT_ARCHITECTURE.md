# 🏗️ Component Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      ROYAL CHESS APP                         │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
   │  HOME   │         │ PROFILE │        │  GAME   │
   │ SCREEN  │         │ SCREEN  │        │ SCREEN  │
   └────┬────┘         └────┬────┘        └────┬────┘
        │                   │                   │
        │                   │                   │
   ┌────▼──────────┐   ┌────▼──────────┐  ┌────▼──────────┐
   │ GameSetup     │   │ ProfileCard   │  │ PlayerInfo    │
   │ Modal         │   │               │  │ (x2)          │
   └────┬──────────┘   └────┬──────────┘  └────┬──────────┘
        │                   │                   │
        │                   │                   │
   ┌────▼──────────┐   ┌────▼──────────┐  ┌────▼──────────┐
   │ OptionSelector│   │ ProfileEdit   │  │ Avatar        │
   │ Slider        │   │ Modal         │  │               │
   │ Button        │   └────┬──────────┘  └───────────────┘
   └───────────────┘        │
                       ┌────▼──────────┐
                       │ OptionSelector│
                       │ Input         │
                       │ Button        │
                       └───────────────┘
```

---

## Component Dependencies

### **UI Primitives** (No dependencies)
```
Button ──────────┐
Modal ───────────┤
Card ────────────┤──> Used by all other components
Avatar ──────────┤
Input ───────────┘
```

### **Common Components** (Use UI Primitives)
```
OptionSelector ──> Button (styled)
EmptyState ──────> Text + View
```

### **Feature Components** (Use UI + Common)
```
GameSetupModal ──┬──> Modal
                 ├──> Button
                 ├──> OptionSelector
                 └──> Slider

PlayerInfo ──────┬──> Avatar
                 └──> Text

ProfileCard ─────┬──> Card
                 ├──> Avatar
                 └──> Button

ProfileEditModal ┬──> Modal
                 ├──> Input
                 ├──> Button
                 └──> OptionSelector
```

---

## Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                     REDUX STORE                          │
│  (user, game, theme, language, session, etc.)           │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ useAppSelector / useAppDispatch
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼────┐ ┌──▼───┐ ┌────▼────┐
   │ Home    │ │Profile│ │  Game   │
   │ Screen  │ │Screen │ │ Screen  │
   └────┬────┘ └──┬───┘ └────┬────┘
        │         │          │
        │ Props   │ Props    │ Props
        │         │          │
   ┌────▼────┐ ┌──▼───┐ ┌────▼────┐
   │Component│ │Comp. │ │Component│
   │         │ │      │ │         │
   └────┬────┘ └──┬───┘ └────┬────┘
        │         │          │
        │ Events  │ Events   │ Events
        │         │          │
   ┌────▼─────────▼──────────▼────┐
   │      Redux Actions            │
   │  (updateProfile, makeMove)    │
   └───────────────────────────────┘
```

---

## Component Reusability Matrix

| Component | Home | Profile | Game | News | Puzzles | Future |
|-----------|------|---------|------|------|---------|--------|
| **Button** | ✅ | ✅ | ✅ | ⚪ | ⚪ | ✅ |
| **Modal** | ✅ | ✅ | ⚪ | ⚪ | ⚪ | ✅ |
| **Card** | ⚪ | ✅ | ⚪ | ⚪ | ⚪ | ✅ |
| **Avatar** | ⚪ | ✅ | ✅ | ⚪ | ⚪ | ✅ |
| **Input** | ⚪ | ✅ | ⚪ | ⚪ | ⚪ | ✅ |
| **OptionSelector** | ✅ | ✅ | ⚪ | ⚪ | ⚪ | ✅ |
| **EmptyState** | ⚪ | ⚪ | ⚪ | ✅ | ✅ | ✅ |
| **GameSetupModal** | ✅ | ⚪ | ⚪ | ⚪ | ⚪ | ✅ |
| **PlayerInfo** | ⚪ | ⚪ | ✅ | ⚪ | ⚪ | ✅ |
| **ProfileCard** | ⚪ | ✅ | ⚪ | ⚪ | ⚪ | ⚪ |
| **ProfileEditModal** | ⚪ | ✅ | ⚪ | ⚪ | ⚪ | ⚪ |

✅ = Currently used  
⚪ = Not used  
Future = Can be reused in upcoming features

---

## Component Props API

### **Button**
```typescript
interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'cancel';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}
```

### **Modal**
```typescript
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  contentStyle?: ViewStyle;
}
```

### **Avatar**
```typescript
interface AvatarProps {
  name: string;
  size?: number;
  isActive?: boolean;
  style?: ViewStyle;
}
```

### **OptionSelector**
```typescript
interface OptionSelectorProps {
  options: Array<{ value: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
}
```

### **PlayerInfo**
```typescript
interface PlayerInfoProps {
  name: string;
  rating: number;
  timeRemaining?: number;
  moveTime?: number;
  isActive?: boolean;
  isOpponent?: boolean;
  style?: ViewStyle;
}
```

### **GameSetupModal**
```typescript
interface GameSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onStartGame: (config: GameConfig) => void;
}

interface GameConfig {
  color: 'white' | 'black' | 'random';
  difficulty: number;
  timeControl: string;
}
```

### **ProfileCard**
```typescript
interface ProfileCardProps {
  name: string;
  isAnonymous: boolean;
  rating: number;
  gamesPlayed: number;
  wins: number;
  favoriteColor: string;
  theme: string;
  onEdit: () => void;
}
```

### **ProfileEditModal**
```typescript
interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

interface ProfileData {
  name: string;
  favoriteColor: 'white' | 'black' | 'random';
  theme: 'light' | 'dark' | 'auto';
}
```

---

## Future Component Roadmap

### **Phase 2: Game Components**
```
components/game/
├── GameTimer.tsx          # Countdown timer
├── MoveHistory.tsx        # Move list display
├── GameControls.tsx       # Resign, Draw, Pause
├── CapturedPieces.tsx     # Captured pieces display
└── GameResult.tsx         # Win/Loss/Draw modal
```

### **Phase 3: Multiplayer Components**
```
components/multiplayer/
├── MatchmakingModal.tsx   # Find opponent
├── ChatBox.tsx            # In-game chat
├── SpectatorList.tsx      # Viewer list
└── InviteFriend.tsx       # Friend invitation
```

### **Phase 4: Puzzle Components**
```
components/puzzles/
├── PuzzleBoard.tsx        # Puzzle chess board
├── PuzzleHint.tsx         # Hint system
├── PuzzleRating.tsx       # Difficulty rating
└── PuzzleProgress.tsx     # Progress tracker
```

---

## Best Practices

### **1. Component Design**
- Keep components small and focused
- Single responsibility principle
- Props over state when possible
- TypeScript for type safety

### **2. Styling**
- Use StyleSheet.create
- Avoid inline styles
- Support custom style props
- Consistent spacing/colors

### **3. Performance**
- Memoize expensive components
- Avoid unnecessary re-renders
- Use React.memo when needed
- Optimize list rendering

### **4. Reusability**
- Generic prop names
- Flexible styling options
- Composition over inheritance
- Clear documentation

---

**Component architecture designed for scale! 🚀**
