# 🚀 Quick Start Guide - Component Usage

## 📦 Import Components

### Single Import
```typescript
import Button from '../../components/ui/Button';
import GameSetupModal from '../../components/game/GameSetupModal';
```

### Multiple Imports (Recommended)
```typescript
import { 
  Button, 
  Modal, 
  Card, 
  Avatar,
  OptionSelector 
} from '../../components';
```

---

## 🎨 Component Examples

### **Button**
```typescript
// Primary button
<Button 
  title="Play Game" 
  onPress={() => console.log('Clicked')} 
/>

// Outline button
<Button 
  title="Cancel" 
  variant="outline" 
  onPress={handleCancel} 
/>

// Disabled button
<Button 
  title="Loading..." 
  disabled={true} 
  onPress={handleSubmit} 
/>

// Custom styled
<Button 
  title="Custom" 
  style={{ backgroundColor: 'red' }}
  textStyle={{ fontSize: 20 }}
  onPress={handleAction} 
/>
```

### **Modal**
```typescript
const [visible, setVisible] = useState(false);

<Modal 
  visible={visible} 
  onClose={() => setVisible(false)}
>
  <Text>Your content here</Text>
  <Button title="Close" onPress={() => setVisible(false)} />
</Modal>
```

### **Avatar**
```typescript
// Basic avatar
<Avatar name="John Doe" />

// Large avatar
<Avatar name="Jane" size={80} />

// Active state (red border)
<Avatar name="Player" size={60} isActive={true} />

// Custom style
<Avatar 
  name="Computer" 
  size={50} 
  style={{ backgroundColor: 'green' }} 
/>
```

### **Card**
```typescript
<Card>
  <Text>Card Title</Text>
  <Text>Card content goes here</Text>
  <Button title="Action" onPress={handleAction} />
</Card>

// Custom styled card
<Card style={{ padding: 30, backgroundColor: '#f0f0f0' }}>
  <Text>Custom card</Text>
</Card>
```

### **Input**
```typescript
const [text, setText] = useState('');

<Input
  value={text}
  onChangeText={setText}
  placeholder="Enter your name"
/>

// Custom styled
<Input
  value={email}
  onChangeText={setEmail}
  placeholder="Email"
  keyboardType="email-address"
  style={{ borderColor: 'blue' }}
/>
```

### **OptionSelector**
```typescript
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

### **EmptyState**
```typescript
// Default message
<EmptyState />

// Custom message
<EmptyState message="No games found" />
```

### **GameSetupModal**
```typescript
const [showModal, setShowModal] = useState(false);

const handleStartGame = (config: GameConfig) => {
  console.log('Starting game with:', config);
  setShowModal(false);
  // Navigate to game screen
};

<GameSetupModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onStartGame={handleStartGame}
/>
```

### **PlayerInfo**
```typescript
// Player
<PlayerInfo
  name="John Doe"
  rating={1500}
  timeRemaining={300}
  moveTime={25}
  isActive={true}
  isOpponent={false}
/>

// Computer opponent
<PlayerInfo
  name="Computer"
  rating={1800}
  timeRemaining={280}
  moveTime={25}
  isActive={false}
  isOpponent={true}
/>
```

### **ProfileCard**
```typescript
<ProfileCard
  name="John Doe"
  isAnonymous={false}
  rating={1500}
  gamesPlayed={50}
  wins={30}
  favoriteColor="white"
  theme="dark"
  onEdit={() => setShowEditModal(true)}
/>
```

### **ProfileEditModal**
```typescript
const [showModal, setShowModal] = useState(false);

const handleSave = (data: ProfileData) => {
  console.log('Saving:', data);
  // Update Redux store
  setShowModal(false);
};

<ProfileEditModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSave={handleSave}
  initialData={{
    name: 'John Doe',
    favoriteColor: 'white',
    theme: 'dark',
  }}
/>
```

---

## 🎯 Common Patterns

### **Form with Multiple Inputs**
```typescript
const [name, setName] = useState('');
const [email, setEmail] = useState('');

<Card>
  <Text>Sign Up</Text>
  
  <Input
    value={name}
    onChangeText={setName}
    placeholder="Name"
  />
  
  <Input
    value={email}
    onChangeText={setEmail}
    placeholder="Email"
    keyboardType="email-address"
  />
  
  <Button title="Submit" onPress={handleSubmit} />
</Card>
```

### **Modal with Form**
```typescript
<Modal visible={showModal} onClose={() => setShowModal(false)}>
  <Text style={styles.title}>Edit Settings</Text>
  
  <Input
    value={username}
    onChangeText={setUsername}
    placeholder="Username"
  />
  
  <OptionSelector
    options={themeOptions}
    selected={theme}
    onSelect={setTheme}
  />
  
  <View style={styles.buttons}>
    <Button 
      title="Cancel" 
      variant="outline" 
      onPress={() => setShowModal(false)} 
    />
    <Button 
      title="Save" 
      onPress={handleSave} 
    />
  </View>
</Modal>
```

### **List with Cards**
```typescript
<ScrollView>
  {games.map((game) => (
    <Card key={game.id} style={styles.gameCard}>
      <Text>{game.opponent}</Text>
      <Text>Result: {game.result}</Text>
      <Button 
        title="View" 
        onPress={() => viewGame(game.id)} 
      />
    </Card>
  ))}
</ScrollView>
```

---

## 🔧 Customization Tips

### **Override Styles**
```typescript
// All components accept style prop
<Button 
  title="Custom" 
  style={{ 
    backgroundColor: 'purple',
    borderRadius: 20,
    paddingVertical: 20 
  }}
/>
```

### **Combine Components**
```typescript
<Card>
  <Avatar name="John" size={60} />
  <Text>John Doe</Text>
  <Button title="Follow" onPress={handleFollow} />
</Card>
```

### **Conditional Rendering**
```typescript
{isLoading ? (
  <EmptyState message="Loading..." />
) : games.length === 0 ? (
  <EmptyState message="No games yet" />
) : (
  <GameList games={games} />
)}
```

---

## 📱 Screen Templates

### **Basic Screen**
```typescript
export default function MyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Screen</Text>
      <Card>
        <Text>Content here</Text>
      </Card>
    </View>
  );
}
```

### **Screen with Modal**
```typescript
export default function MyScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <Button 
        title="Open Modal" 
        onPress={() => setShowModal(true)} 
      />
      
      <Modal 
        visible={showModal} 
        onClose={() => setShowModal(false)}
      >
        <Text>Modal Content</Text>
      </Modal>
    </View>
  );
}
```

### **Screen with Form**
```typescript
export default function FormScreen() {
  const [name, setName] = useState('');
  const [color, setColor] = useState('white');

  const handleSubmit = () => {
    console.log({ name, color });
  };

  return (
    <View style={styles.container}>
      <Card>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        
        <OptionSelector
          options={colorOptions}
          selected={color}
          onSelect={setColor}
        />
        
        <Button title="Submit" onPress={handleSubmit} />
      </Card>
    </View>
  );
}
```

---

## 🐛 Troubleshooting

### **Import Errors**
```typescript
// ❌ Wrong
import Button from 'components/ui/Button';

// ✅ Correct
import Button from '../../components/ui/Button';
// or
import { Button } from '../../components';
```

### **Type Errors**
```typescript
// Make sure to import types
import { GameConfig } from '../../components/game/GameSetupModal';
import { ProfileData } from '../../components/profile/ProfileEditModal';
```

### **Style Not Applying**
```typescript
// Use array syntax for multiple styles
<Button 
  style={[styles.button, customStyle]} 
  title="Click" 
/>
```

---

## 📚 Resources

- **Component Library**: `/components/`
- **Documentation**: `REFACTORING_SUMMARY.md`
- **Architecture**: `COMPONENT_ARCHITECTURE.md`
- **Redux Store**: `/services/store.md`

---

**Happy coding! 🎉**
