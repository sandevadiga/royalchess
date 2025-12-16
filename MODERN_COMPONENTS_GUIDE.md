# Modern Components Quick Start Guide

## Installation & Setup

The modern design system is ready to use. Simply import the components you need:

```typescript
import { ModernButton, ModernCard, Surface, Badge, Chip } from '../components/ui';
import { useModernTheme } from '../common/styles/themes/useModernTheme';
```

## Core Concepts

### 1. Design Tokens
Access design tokens through the theme hook:

```typescript
const { theme } = useModernTheme();

// Spacing
theme.spacing.xs    // 4
theme.spacing.sm    // 8
theme.spacing.md    // 12
theme.spacing.lg    // 16
theme.spacing.xl    // 20

// Colors
theme.colors.primary
theme.colors.textPrimary
theme.colors.surface
theme.colors.glassLight

// Typography
theme.typography.fontSize.base
theme.typography.fontWeight.bold

// Shadows
theme.shadows.sm
theme.shadows.md
```

### 2. Component Variants
Most components support variants for different use cases:

```typescript
// Button variants
<ModernButton variant="primary">Primary</ModernButton>
<ModernButton variant="secondary">Secondary</ModernButton>
<ModernButton variant="outline">Outline</ModernButton>
<ModernButton variant="ghost">Ghost</ModernButton>
<ModernButton variant="glass">Glass</ModernButton>
<ModernButton variant="danger">Danger</ModernButton>

// Card variants
<ModernCard variant="default">Default</ModernCard>
<ModernCard variant="elevated">Elevated</ModernCard>
<ModernCard variant="outlined">Outlined</ModernCard>
<ModernCard variant="glass">Glass</ModernCard>
```

### 3. Size System
Components support consistent sizing:

```typescript
<ModernButton size="sm">Small</ModernButton>
<ModernButton size="md">Medium</ModernButton>
<ModernButton size="lg">Large</ModernButton>

<Badge size="sm">Small Badge</Badge>
<Badge size="md">Medium Badge</Badge>
<Badge size="lg">Large Badge</Badge>
```

## Component Examples

### ModernButton
```typescript
import ModernButton from '../components/ui/ModernButton';

// Basic usage
<ModernButton onPress={handlePress}>
  Click Me
</ModernButton>

// With all options
<ModernButton
  onPress={handlePress}
  variant="primary"
  size="lg"
  fullWidth
  disabled={false}
  loading={isLoading}
  leftIcon={<Icon name="play" />}
  rightIcon={<Icon name="arrow-right" />}
>
  Start Game
</ModernButton>
```

### ModernCard
```typescript
import ModernCard from '../components/ui/ModernCard';

// Basic card
<ModernCard>
  <Text>Card content</Text>
</ModernCard>

// Glass card with padding
<ModernCard variant="glass" padding="lg">
  <Text>Glass effect card</Text>
</ModernCard>

// Pressable card
<ModernCard onPress={handlePress}>
  <Text>Tap me</Text>
</ModernCard>
```

### Surface
```typescript
import Surface from '../components/ui/Surface';

// Glass surface
<Surface glass={true} elevation={2}>
  <Text>Frosted glass effect</Text>
</Surface>

// Elevated surface
<Surface variant="elevated" padding={16}>
  <Text>Elevated surface</Text>
</Surface>

// Pressable surface
<Surface onPress={handlePress}>
  <Text>Interactive surface</Text>
</Surface>
```

### ModernModal
```typescript
import ModernModal from '../components/ui/ModernModal';

const [visible, setVisible] = useState(false);

<ModernModal
  visible={visible}
  onClose={() => setVisible(false)}
  glass={true}
  position="bottom"
>
  <Text>Modal content</Text>
  <ModernButton onPress={() => setVisible(false)}>
    Close
  </ModernButton>
</ModernModal>
```

### Badge
```typescript
import Badge from '../components/ui/Badge';

// Different variants
<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Chip
```typescript
import Chip from '../components/ui/Chip';

const [selected, setSelected] = useState(false);

// Basic chip
<Chip onPress={() => setSelected(!selected)}>
  Option
</Chip>

// Selected chip
<Chip selected={selected} onPress={() => setSelected(!selected)}>
  Selected Option
</Chip>

// With icon
<Chip
  selected={selected}
  onPress={() => setSelected(!selected)}
  leftIcon={<Icon name="check" />}
>
  With Icon
</Chip>
```

### ModernInput
```typescript
import ModernInput from '../components/ui/ModernInput';

const [text, setText] = useState('');

<ModernInput
  label="Username"
  value={text}
  onChangeText={setText}
  placeholder="Enter username"
  error={error}
  leftIcon={<Icon name="user" />}
  variant="outlined"
/>
```

### GlassView
```typescript
import GlassView from '../components/ui/GlassView';

<GlassView
  variant="medium"
  intensity={20}
  borderRadius={16}
  withBorder={true}
>
  <Text>Frosted glass container</Text>
</GlassView>
```

## Common Patterns

### Form with Modern Components
```typescript
function LoginForm() {
  const { theme } = useModernTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ModernCard variant="elevated" padding="lg">
      <Text style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        marginBottom: theme.spacing.lg
      }}>
        Login
      </Text>

      <ModernInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        variant="outlined"
      />

      <ModernInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        variant="outlined"
        containerStyle={{ marginTop: theme.spacing.md }}
      />

      <ModernButton
        onPress={handleLogin}
        size="lg"
        fullWidth
        style={{ marginTop: theme.spacing.lg }}
      >
        Login
      </ModernButton>
    </ModernCard>
  );
}
```

### Stats Display with Glass
```typescript
function StatsCard() {
  const { theme } = useModernTheme();

  return (
    <Surface glass={true} elevation={2} padding={theme.spacing.xl}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary
          }}>
            1500
          </Text>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textSecondary
          }}>
            Rating
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary
          }}>
            50
          </Text>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textSecondary
          }}>
            Games
          </Text>
        </View>
      </View>
    </Surface>
  );
}
```

### Feature Cards
```typescript
function FeatureList() {
  const { theme } = useModernTheme();

  return (
    <View style={{ gap: theme.spacing.md }}>
      <ModernCard variant="outlined" padding="lg" onPress={handleFeature1}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.textPrimary
            }}>
              Feature Name
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary
            }}>
              Feature description
            </Text>
          </View>
          <Badge variant="success" size="sm">New</Badge>
        </View>
      </ModernCard>
    </View>
  );
}
```

### Modal with Form
```typescript
function EditModal({ visible, onClose }) {
  const { theme } = useModernTheme();
  const [name, setName] = useState('');

  return (
    <ModernModal
      visible={visible}
      onClose={onClose}
      glass={true}
      position="bottom"
    >
      <Text style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        marginBottom: theme.spacing.lg
      }}>
        Edit Profile
      </Text>

      <ModernInput
        label="Name"
        value={name}
        onChangeText={setName}
        variant="outlined"
      />

      <View style={{
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.lg
      }}>
        <ModernButton
          onPress={onClose}
          variant="ghost"
          style={{ flex: 1 }}
        >
          Cancel
        </ModernButton>
        <ModernButton
          onPress={handleSave}
          style={{ flex: 1 }}
        >
          Save
        </ModernButton>
      </View>
    </ModernModal>
  );
}
```

## Styling Best Practices

### 1. Use Theme Tokens
```typescript
// Good
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
  }
});

// Bad - hardcoded values
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  }
});
```

### 2. Consistent Spacing
```typescript
// Use spacing scale
<View style={{ gap: theme.spacing.md }}>
  <Item />
  <Item />
</View>

// Use margin/padding from theme
<View style={{
  marginTop: theme.spacing.lg,
  paddingHorizontal: theme.spacing.xl
}}>
```

### 3. Typography Scale
```typescript
<Text style={{
  fontSize: theme.typography.fontSize.lg,
  fontWeight: theme.typography.fontWeight.bold,
  lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal
}}>
  Heading
</Text>
```

### 4. Elevation/Shadows
```typescript
<View style={{
  ...theme.shadows.md,
  backgroundColor: theme.colors.surface
}}>
```

## Tips & Tricks

### 1. Combining Components
```typescript
<ModernCard variant="glass" padding="lg">
  <Surface elevation={0}>
    <ModernButton variant="primary" fullWidth>
      Action
    </ModernButton>
  </Surface>
</ModernCard>
```

### 2. Conditional Styling
```typescript
<ModernButton
  variant={isPrimary ? 'primary' : 'outline'}
  disabled={!isValid}
>
  Submit
</ModernButton>
```

### 3. Theme-Aware Custom Components
```typescript
function CustomComponent() {
  const { theme, isDark } = useModernTheme();

  return (
    <View style={{
      backgroundColor: isDark ? theme.colors.surface : theme.colors.background
    }}>
      {/* content */}
    </View>
  );
}
```

### 4. Responsive Sizing
```typescript
const isSmallScreen = Dimensions.get('window').width < 375;

<ModernButton size={isSmallScreen ? 'sm' : 'md'}>
  Button
</ModernButton>
```

## Troubleshooting

### Issue: Theme not updating
```typescript
// Ensure you're using the theme hook
const { theme } = useModernTheme();

// Not static import
// import { lightTheme } from '../themes'; // Wrong
```

### Issue: Glass effect not visible
```typescript
// Make sure parent has background
<View style={{ backgroundColor: 'transparent' }}> // Wrong
<View style={{ backgroundColor: theme.colors.background }}> // Correct
  <GlassView>...</GlassView>
</View>
```

### Issue: Shadows not showing
```typescript
// On Android, use elevation
<View style={{
  ...theme.shadows.md, // Includes elevation for Android
  backgroundColor: theme.colors.surface // Required for shadows
}}>
```

## Next Steps

1. Explore more components in `components/ui/`
2. Check `MODERN_REFACTOR.md` for detailed documentation
3. See `app/(tabs)/index.tsx` for real-world examples
4. Review `common/styles/designSystem.ts` for all available tokens

Happy coding with modern components!
