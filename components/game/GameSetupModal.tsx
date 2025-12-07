import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState, useCallback, memo, useMemo, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import OptionSelector from '../common/OptionSelector';
import { useTheme } from '../../common/styles/themes/useTheme';
import { SPACING, RADIUS, FONT } from '../../constants';
import { useAppSelector } from '../../services/hooks';

interface GameSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onStartGame: (config: GameConfig) => void;
}

export interface GameConfig {
  color: 'white' | 'black' | 'random';
  difficulty: number; // ELO rating (800-2400)
  timeControl: string;
}

function GameSetupModal({ visible, onClose, onStartGame }: GameSetupModalProps) {
  const { theme } = useTheme();
  const computerDifficulty = useAppSelector(state => state.user.computerDifficulty ?? 1200);
  const [selectedColor, setSelectedColor] = useState<'white' | 'black' | 'random'>('white');
  const [difficulty, setDifficulty] = useState(1200);
  const [timeControl, setTimeControl] = useState('blitz');
  
  useEffect(() => {
    if (visible) {
      setDifficulty(computerDifficulty);
    }
  }, [visible, computerDifficulty]);

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

  const getDifficultyLabel = useCallback((rating: number) => {
    if (rating < 1000) return `Beginner (${rating})`;
    if (rating < 1400) return `Intermediate (${rating})`;
    if (rating < 1800) return `Advanced (${rating})`;
    if (rating < 2200) return `Expert (${rating})`;
    return `Master (${rating})`;
  }, []);

  const handleStart = useCallback(() => {
    onStartGame({ color: selectedColor, difficulty, timeControl });
  }, [selectedColor, difficulty, timeControl, onStartGame]);

  const handleColorSelect = useCallback((value: string) => {
    setSelectedColor(value as any);
  }, []);

  const handleTimeSelect = useCallback((value: string) => {
    setTimeControl(value);
  }, []);
  
  const handleSliderChange = useCallback((value: number) => {
    setDifficulty(Math.round(value));
  }, []);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Choose Your Team</Text>
      
      <OptionSelector
        options={colorOptions}
        selected={selectedColor}
        onSelect={handleColorSelect}
        style={styles.section}
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Time Control</Text>
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

      <View style={[styles.difficultyContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.difficultyTitle, { color: theme.colors.text }]}>
          {getDifficultyLabel(difficulty)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={800}
          maximumValue={2400}
          step={10}
          value={difficulty}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary}
        />
        <View style={styles.ratingRange}>
          <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>800</Text>
          <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>2400</Text>
        </View>
      </View>

      <Button title="Play" onPress={handleStart} style={styles.playButton} />
      <Button title="Cancel" variant="cancel" onPress={onClose} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONT.XXL,
    fontWeight: 'bold',
    marginBottom: SPACING.XXL,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.XXL,
  },
  sectionTitle: {
    fontSize: FONT.BASE,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.XL,
  },
  timeButton: {
    width: '48%',
    marginBottom: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  timeButtonText: {
    fontSize: FONT.SM,
  },
  difficultyContainer: {
    width: '100%',
    marginBottom: SPACING.XXL,
    padding: SPACING.LG,
    borderRadius: RADIUS.XL,
  },
  difficultyTitle: {
    fontSize: FONT.BASE,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  playButton: {
    marginBottom: SPACING.LG,
    borderRadius: RADIUS.ROUND,
    paddingVertical: 16,
  },
  ratingRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.SM,
  },
  ratingText: {
    fontSize: FONT.SM,
  },
});

export default memo(GameSetupModal);
