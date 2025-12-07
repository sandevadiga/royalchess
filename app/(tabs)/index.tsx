import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import GameSetupModal, { GameConfig } from '../../components/game/GameSetupModal';

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);

  const handleStartGame = (config: GameConfig) => {
    setShowModal(false);
    const finalColor = config.color === 'random' 
      ? (Math.random() > 0.5 ? 'white' : 'black') 
      : config.color;
    router.push(`/chess-game?color=${finalColor}&difficulty=${config.difficulty}&timeControl=${config.timeControl}`);
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Play with Computer" 
        onPress={() => setShowModal(true)}
      />

      <GameSetupModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onStartGame={handleStartGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});