# 🎨 Constants

## Purpose
Centralized constants to eliminate hardcoded values across the app.

## Files
- `index.ts` - All app constants

## Constants Available

### LAYOUT
```typescript
MODAL_WIDTH: '85%'
AVATAR_SIZE_DEFAULT: 40
AVATAR_SIZE_LARGE: 80
BUTTON_PADDING_H: 30
BUTTON_PADDING_V: 15
CARD_PADDING: 20
SCREEN_PADDING: 20
BOARD_SIZE: 300
```

### COLORS
```typescript
PRIMARY: '#007AFF'
SECONDARY: '#5856D6'
ERROR: '#FF3B30'
WARNING: '#FF6B35'
TEXT_PRIMARY: '#333'
TEXT_SECONDARY: '#666'
TEXT_TERTIARY: '#888'
BORDER: '#ddd'
BORDER_LIGHT: '#e0e0e0'
BG_LIGHT: '#f8f8f8'
BG_GRAY: '#f5f5f5'
BG_DARK: '#f0f0f0'
WHITE: '#fff'
BLACK: '#000'
OVERLAY: 'rgba(0,0,0,0.5)'
```

### SPACING
```typescript
XS: 4
SM: 8
MD: 12
LG: 15
XL: 20
XXL: 25
```

### RADIUS
```typescript
SM: 5
MD: 8
LG: 10
XL: 12
XXL: 15
XXXL: 20
ROUND: 25
```

### FONT
```typescript
XS: 12
SM: 13
MD: 14
BASE: 16
LG: 18
XL: 20
XXL: 22
XXXL: 24
```

### SHADOW
```typescript
SMALL: { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation }
MEDIUM: { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation }
```

## Usage

```typescript
import { COLORS, SPACING, RADIUS, FONT } from '../../constants';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MD,
    borderRadius: RADIUS.LG,
    fontSize: FONT.BASE,
  },
});
```

## Components Using Constants

✅ Button  
✅ Modal  
✅ Card  
✅ Avatar  
✅ Input  
✅ EmptyState  
✅ OptionSelector  
✅ PlayerInfo  
✅ GameSetupModal  

## Benefits

✅ No hardcoded values  
✅ Easy to change globally  
✅ Consistent design  
✅ Type-safe  
✅ Maintainable  

**Last Updated:** After removing hardcoded values
