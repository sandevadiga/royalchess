# 🎨 UI Components

## 📁 Files in This Folder

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `Button.tsx` | Reusable button with 4 variants | 65 | ✅ Active |
| `Modal.tsx` | Modal wrapper with overlay | 35 | ✅ Active |
| `Card.tsx` | Container card with shadow | 30 | ✅ Active |
| `Avatar.tsx` | User/Computer avatar display | 45 | ✅ Active |
| `Input.tsx` | Styled text input field | 25 | ✅ Active |

---

## 🔍 Component Details

### **Button.tsx**
**Purpose:** Primary UI button with multiple variants

**Props:**
```typescript
{
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'cancel';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}
```

**Used In:**
- ✅ `app/(tabs)/index.tsx` - Play button
- ✅ `components/game/GameSetupModal.tsx` - Play, Cancel, Time control buttons
- ✅ `components/profile/ProfileCard.tsx` - Edit button
- ✅ `components/profile/ProfileEditModal.tsx` - Save, Cancel buttons

**Dependencies:** None (primitive component)

**Change Impact:** 🔴 HIGH - Used in 4+ places

---

### **Modal.tsx**
**Purpose:** Reusable modal overlay wrapper

**Props:**
```typescript
{
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  contentStyle?: ViewStyle;
}
```

**Used In:**
- ✅ `components/game/GameSetupModal.tsx` - Game setup modal
- ✅ `components/profile/ProfileEditModal.tsx` - Profile edit modal

**Dependencies:** None (primitive component)

**Change Impact:** 🟡 MEDIUM - Used in 2 places

---

### **Card.tsx**
**Purpose:** Container with shadow and rounded corners

**Props:**
```typescript
{
  children: ReactNode;
  style?: ViewStyle;
}
```

**Used In:**
- ✅ `components/profile/ProfileCard.tsx` - Profile container

**Dependencies:** None (primitive component)

**Change Impact:** 🟢 LOW - Used in 1 place

---

### **Avatar.tsx**
**Purpose:** Display user/computer avatar with initial

**Props:**
```typescript
{
  name: string;
  size?: number;
  isActive?: boolean;
  style?: ViewStyle;
}
```

**Used In:**
- ✅ `components/game/PlayerInfo.tsx` - Player/Computer avatar
- ✅ `components/profile/ProfileCard.tsx` - Profile avatar

**Dependencies:** None (primitive component)

**Change Impact:** 🟡 MEDIUM - Used in 2 places

---

### **Input.tsx**
**Purpose:** Styled text input with consistent design

**Props:**
```typescript
{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  ...TextInputProps
}
```

**Used In:**
- ✅ `components/profile/ProfileEditModal.tsx` - Name input

**Dependencies:** None (primitive component)

**Change Impact:** 🟢 LOW - Used in 1 place

---

## 🔗 Dependencies

```
Button ──────────┐
Modal ───────────┤
Card ────────────┤──> No dependencies (primitives)
Avatar ──────────┤
Input ───────────┘
```

---

## ⚠️ Change Impact Matrix

| Component | Impact | Affected Files | Test Required |
|-----------|--------|----------------|---------------|
| Button | 🔴 HIGH | 4 files | ✅ Yes |
| Modal | 🟡 MEDIUM | 2 files | ✅ Yes |
| Card | 🟢 LOW | 1 file | ⚪ Optional |
| Avatar | 🟡 MEDIUM | 2 files | ✅ Yes |
| Input | 🟢 LOW | 1 file | ⚪ Optional |

---

## 📝 Usage Examples

### Button
```typescript
import Button from '../../components/ui/Button';

<Button title="Play" onPress={handlePlay} />
<Button title="Cancel" variant="outline" onPress={handleCancel} />
```

### Modal
```typescript
import Modal from '../../components/ui/Modal';

<Modal visible={show} onClose={handleClose}>
  <Text>Content</Text>
</Modal>
```

### Card
```typescript
import Card from '../../components/ui/Card';

<Card>
  <Text>Card content</Text>
</Card>
```

### Avatar
```typescript
import Avatar from '../../components/ui/Avatar';

<Avatar name="John" size={60} isActive={true} />
```

### Input
```typescript
import Input from '../../components/ui/Input';

<Input
  value={text}
  onChangeText={setText}
  placeholder="Enter name"
/>
```

---

## 🚀 Adding New UI Components

1. Create new file in this folder
2. Follow naming convention: `ComponentName.tsx`
3. Export from `components/index.ts`
4. Update this README
5. Add usage examples

---

## 🐛 Common Issues

**Issue:** Button not responding  
**Fix:** Check `onPress` prop is provided

**Issue:** Modal not closing  
**Fix:** Ensure `onClose` updates `visible` state

**Issue:** Avatar showing 'A'  
**Fix:** Pass valid `name` prop

---

**Last Updated:** After refactoring  
**Maintainer:** Development Team
