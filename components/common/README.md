# 🔧 Common Components

## 📁 Files in This Folder

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `EmptyState.tsx` | "Coming Soon" placeholder | 20 | ✅ Active |
| `OptionSelector.tsx` | Generic option picker | 60 | ✅ Active |

---

## 🔍 Component Details

### **EmptyState.tsx**
**Purpose:** Display placeholder for empty/upcoming screens

**Props:**
```typescript
{
  message?: string; // Default: "Coming Soon"
}
```

**Used In:**
- ✅ `app/(tabs)/news.tsx` - News screen
- ✅ `app/(tabs)/puzzles.tsx` - Puzzles screen

**Dependencies:** None (primitive component)

**Change Impact:** 🟡 MEDIUM - Used in 2 places

---

### **OptionSelector.tsx**
**Purpose:** Generic option picker with visual selection

**Props:**
```typescript
{
  options: Array<{ value: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
}
```

**Used In:**
- ✅ `components/game/GameSetupModal.tsx` - Color selection
- ✅ `components/profile/ProfileEditModal.tsx` - Color & theme selection

**Dependencies:** None (primitive component)

**Change Impact:** 🟡 MEDIUM - Used in 2 places

---

## 🔗 Dependencies

```
EmptyState ──────> None (primitive)
OptionSelector ──> None (primitive)
```

---

## ⚠️ Change Impact Matrix

| Component | Impact | Affected Files | Test Required |
|-----------|--------|----------------|---------------|
| EmptyState | 🟡 MEDIUM | 2 files | ✅ Yes |
| OptionSelector | 🟡 MEDIUM | 2 files | ✅ Yes |

---

## 📝 Usage Examples

### EmptyState
```typescript
import EmptyState from '../../components/common/EmptyState';

// Default message
<EmptyState />

// Custom message
<EmptyState message="No games found" />
<EmptyState message="Puzzles Coming Soon" />
```

### OptionSelector
```typescript
import OptionSelector from '../../components/common/OptionSelector';

const [selected, setSelected] = useState('white');

const options = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'random', label: 'Random' },
];

<OptionSelector
  options={options}
  selected={selected}
  onSelect={setSelected}
/>
```

---

## 🎯 Use Cases

### EmptyState
- Placeholder screens (News, Puzzles)
- Empty lists (no games, no friends)
- Loading states
- Error states

### OptionSelector
- Color selection (white/black/random)
- Theme selection (light/dark/auto)
- Time control selection (blitz/rapid/classical)
- Any multiple-choice selection

---

## 🚀 Future Components (Planned)

- [ ] `LoadingSpinner.tsx` - Loading indicator
- [ ] `ErrorBoundary.tsx` - Error handling
- [ ] `Toast.tsx` - Notification toast
- [ ] `Tabs.tsx` - Tab navigation
- [ ] `SearchBar.tsx` - Search input

---

## 🐛 Common Issues

**Issue:** OptionSelector not updating  
**Fix:** Ensure `selected` state is updated in `onSelect`

**Issue:** EmptyState not centered  
**Fix:** Parent container needs `flex: 1`

---

**Last Updated:** After refactoring  
**Maintainer:** Development Team
