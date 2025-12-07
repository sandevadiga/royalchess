import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState, useCallback } from 'react';
import Button from '../../components/ui/Button';
import GameSetupModal, { GameConfig } from '../../components/game/GameSetupModal';

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleStartGame = useCallback((config: GameConfig) => {
    setShowModal(false);
    const finalColor = config.color === 'random' 
      ? (Math.random() > 0.5 ? 'white' : 'black') 
      : config.color;
    router.push(`/chess-game?color=${finalColor}&difficulty=${config.difficulty}&timeControl=${config.timeControl}`);
  }, []);

  return (
    <View style={styles.container}>
      <Button 
        title="Play with Computer" 
        onPress={handleOpenModal}
      />

      <GameSetupModal
        visible={showModal}
        onClose={handleCloseModal}
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