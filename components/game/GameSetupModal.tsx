import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState, useCallback, memo, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import OptionSelector from '../common/OptionSelector';

interface GameSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onStartGame: (config: GameConfig) => void;
}

export interface GameConfig {
  color: 'white' | 'black' | 'random';
  difficulty: number;
  timeControl: string;
}

function GameSetupModal({ visible, onClose, onStartGame }: GameSetupModalProps) {
  const [selectedColor, setSelectedColor] = useState<'white' | 'black' | 'random'>('white');
  const [difficulty, setDifficulty] = useState(3);
  const [timeControl, setTimeControl] = useState('blitz');

  const colorOptions = useMemo(() => [
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
    { value: 'random', label: 'Random' },
  ], []);

  const timeOptions = useMemo(() => [
    { value: 'blitz', label: 'Blitz 5min' },
    { value: 'rapid', label: 'Rapid 10min' },
    { value: 'classical', label: 'Classical 30min' },
    { value: 'timeless', label: 'Timeless' },
  ], []);

  const difficultyLabels = useMemo(() => ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'], []);

  const handleStart = useCallback(() => {
    onStartGame({ color: selectedColor, difficulty, timeControl });
  }, [selectedColor, difficulty, timeControl, onStartGame]);

  const handleColorSelect = useCallback((value: string) => {
    setSelectedColor(value as any);
  }, []);

  const handleTimeSelect = useCallback((value: string) => {
    setTimeControl(value);
  }, []);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Text style={styles.title}>Choose Your Team</Text>
      
      <OptionSelector
        options={colorOptions}
        selected={selectedColor}
        onSelect={handleColorSelect}
        style={styles.section}
      />

      <Text style={styles.sectionTitle}>Time Control</Text>
      <View style={styles.timeGrid}>
        {timeOptions.map((option) => (
          <Button
            key={option.value}
            title={option.label}
            variant={timeControl === option.value ? 'primary' : 'outline'}
            onPress={() => handleTimeSelect(option.value)}
            style={styles.timeButton}
            textStyle={styles.timeButtonText}
          />
        ))}
      </View>

      <View style={styles.difficultyContainer}>
        <Text style={styles.difficultyTitle}>
          Difficulty: {difficultyLabels[difficulty - 1]}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={difficulty}
          onValueChange={setDifficulty}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007AFF"
        />
      </View>

      <Button title="Play" onPress={handleStart} style={styles.playButton} />
      <Button title="Cancel" variant="cancel" onPress={onClose} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    width: '48%',
    marginBottom: 10,
    paddingVertical: 12,
  },
  timeButtonText: {
    fontSize: 13,
  },
  difficultyContainer: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  playButton: {
    marginBottom: 15,
    borderRadius: 25,
    paddingVertical: 16,
  },
});

export default memo(GameSetupModal);
