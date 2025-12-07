# 🛡️ ErrorBoundary Component

## Purpose
Catches JavaScript errors anywhere in the component tree and displays a fallback UI instead of crashing the app.

## Usage

### Basic Usage
```typescript
import ErrorBoundary from '../../components/common/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### With Custom Fallback
```typescript
<ErrorBoundary 
  fallback={
    <View>
      <Text>Custom error message</Text>
    </View>
  }
>
  <YourComponent />
</ErrorBoundary>
```

### Root Level (Recommended)
```typescript
// app/_layout.tsx
<ErrorBoundary>
  <Provider store={store}>
    <App />
  </Provider>
</ErrorBoundary>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | Components to protect |
| fallback | ReactNode | No | Custom error UI |

## Features

✅ **Catches errors** - Prevents app crashes  
✅ **Shows fallback UI** - User-friendly error screen  
✅ **Try again button** - Resets error state  
✅ **Logs errors** - Console logging for debugging  
✅ **Custom fallback** - Optional custom error UI  

## Default Error Screen

Shows:
- Error title: "Oops! Something went wrong"
- Error message
- "Try Again" button to reset

## When It Catches Errors

✅ Rendering errors  
✅ Lifecycle method errors  
✅ Constructor errors  
✅ Event handler errors (in render)  

## When It DOESN'T Catch

❌ Event handlers (outside render)  
❌ Async code (setTimeout, promises)  
❌ Server-side rendering  
❌ Errors in ErrorBoundary itself  

## Best Practices

1. **Wrap at root level** - Protects entire app
2. **Wrap critical sections** - Isolate important features
3. **Add logging** - Track errors in production
4. **Custom fallback** - Match your app's design
5. **Test it** - Throw errors in dev to verify

## Example: Protecting a Screen

```typescript
// chess-game.tsx
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function ChessGameScreen() {
  return (
    <ErrorBoundary>
      <View>
        <Chessboard />
        <PlayerInfo />
      </View>
    </ErrorBoundary>
  );
}
```

## Example: Custom Fallback

```typescript
<ErrorBoundary
  fallback={
    <Card>
      <Text style={styles.error}>Game Error</Text>
      <Button title="Restart Game" onPress={handleRestart} />
    </Card>
  }
>
  <GameBoard />
</ErrorBoundary>
```

## Testing

```typescript
// Create a component that throws
function BuggyComponent() {
  throw new Error('Test error');
  return <Text>Never renders</Text>;
}

// Wrap it
<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>

// Should show error screen instead of crashing
```

## Integration

Currently integrated at:
- ✅ Root level (`app/_layout.tsx`)

Recommended for:
- [ ] Chess game screen
- [ ] Profile screen
- [ ] Individual complex components

## Benefits

✅ **Better UX** - No white screen crashes  
✅ **Graceful degradation** - App stays usable  
✅ **Error tracking** - Know when things break  
✅ **User confidence** - Professional error handling  

**Last Updated:** After adding error boundary
