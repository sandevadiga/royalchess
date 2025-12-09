import Slider from '@react-native-community/slider';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../common/styles/themes/useTheme';
import { FONT, RADIUS, SPACING } from '../../constants';
import { useAppSelector } from '../../services/hooks';
import OptionSelector from '../common/OptionSelector';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

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
  const { theme } = useTheme();
  const computerDifficulty = useAppSelector(state => state.user.computerDifficulty ?? 1200);

  const [selectedColor, setSelectedColor] = useState<'white' | 'black' | 'random'>('white');
  const [difficulty, setDifficulty] = useState(1200);
  const [timeControl, setTimeControl] = useState('blitz');

  useEffect(() => {
    if (visible) setDifficulty(computerDifficulty);
  }, [visible, computerDifficulty]);

  const colorOptions = useMemo(() => [
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
    { value: 'random', label: 'Random' },
  ], []);

  const timeOptions = useMemo(() => [
    { value: 'blitz', label: '5', unit: 'min', icon: '⏱️' },
    { value: 'rapid', label: '10', unit: 'min', icon: '⏰' },
    { value: 'classical', label: '30', unit: 'min', icon: '🕐' },
    { value: 'timeless', label: 'Timeless', unit: '', icon: '∞' },
  ], []);

  const getDifficultyLabel = useCallback((rating: number) => {
    if (rating < 1000) return `Beginner • ${rating}`;
    if (rating < 1400) return `Intermediate • ${rating}`;
    if (rating < 1800) return `Advanced • ${rating}`;
    if (rating < 2200) return `Expert • ${rating}`;
    return `Master • ${rating}`;
  }, []);

  const handleStart = useCallback(() => {
    onStartGame({ color: selectedColor, difficulty, timeControl });
  }, [selectedColor, difficulty, timeControl, onStartGame]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      contentStyle={{ backgroundColor: theme.colors.background }}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>New Game</Text>

      {/* Color Selection Card */}
      <OptionSelector
        options={colorOptions}
        selected={selectedColor}
        onSelect={(v) => setSelectedColor(v as any)}
      />

      {/* Time Control Card */}

      <View style={styles.timeGrid}>
        {timeOptions.map((option) => {
          const active = timeControl === option.value;
          return (
            <View
              key={option.value}
              style={[
                styles.timeButton,
                { backgroundColor: active ? theme.colors.se + '15' : theme.colors.primary },
                active && { borderColor: theme.colors.primary, borderWidth: 2 },
              ]}
              onTouchEnd={() => setTimeControl(option.value)}
            >
              {option.icon && <Text style={styles.timeIcon}>{option.icon}</Text>}
              <Text style={[styles.timeValue, { color: active ? theme.colors.primary : theme.colors.text }]}>
                {option.label}
              </Text>
              {option.unit && (
                <Text style={[styles.timeUnit, { color: active ? theme.colors.primary : theme.colors.textSecondary }]}>
                  {option.unit}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Difficulty Card */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>


        <Text style={[styles.difficultyText, { color: theme.colors.primary }]}>
          {getDifficultyLabel(difficulty)}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={800}
          maximumValue={2400}
          step={10}
          value={difficulty}
          onValueChange={(v) => setDifficulty(Math.round(v))}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary}
        />

        <View style={styles.range}>
          <Text style={[styles.rangeText, { color: theme.colors.textSecondary }]}>800</Text>
          <Text style={[styles.rangeText, { color: theme.colors.textSecondary }]}>2400</Text>
        </View>
      </View>

      {/* Actions */}
      <Button
        title="Play"
        onPress={handleStart}
        style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
        textStyle={styles.playText}
      />

      <Button
        title="Cancel"
        variant="cancel"
        onPress={onClose}
        style={styles.cancelButton}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONT.XXL,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },

  card: {
    borderRadius: RADIUS.XL,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },

  sectionTitle: {
    fontSize: FONT.MD,
    fontWeight: '600',
    marginBottom: SPACING.MD,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
    padding: 20,
  },

  timeButton: {
    width: '48%',
    paddingVertical: SPACING.LG,
    borderRadius: RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(178, 178, 174, 0.27)'
  },

  timeIcon: {
    fontSize: 18,
    marginBottom: 2,
  },

  timeValue: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },

  timeUnit: {
    fontSize: FONT.XS,
    fontWeight: '600',
    marginTop: 1,
  },

  difficultyText: {
    fontSize: FONT.LG,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },

  slider: {
    height: 40,
  },

  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.XS,
  },

  rangeText: {
    fontSize: FONT.SM,
    fontWeight: '500',
  },

  playButton: {
    marginTop: SPACING.SM,
    marginBottom: SPACING.MD,
    borderRadius: RADIUS.XL,
    paddingVertical: SPACING.LG,
  },

  playText: {
    fontSize: FONT.LG,
    fontWeight: '700',
    color: '#fff',
  },

  cancelButton: {
    paddingVertical: SPACING.MD,
  },
});

export default memo(GameSetupModal);