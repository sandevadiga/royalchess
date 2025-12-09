import Slider from '@react-native-community/slider';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

  const getDifficultyInfo = useCallback((rating: number) => {
    if (rating < 1000) return { label: 'Beginner', emoji: '🌱', color: '#34C759' };
    if (rating < 1400) return { label: 'Intermediate', emoji: '📚', color: '#5AC8FA' };
    if (rating < 1800) return { label: 'Advanced', emoji: '⚡', color: '#FF9500' };
    if (rating < 2200) return { label: 'Expert', emoji: '🔥', color: '#FF453A' };
    return { label: 'Master', emoji: '👑', color: '#BF5AF2' };
  }, []);

  const difficultyInfo = useMemo(() => getDifficultyInfo(difficulty), [difficulty, getDifficultyInfo]);

  const handleStart = useCallback(() => {
    onStartGame({ color: selectedColor, difficulty, timeControl });
  }, [selectedColor, difficulty, timeControl, onStartGame]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      contentStyle={{ backgroundColor: theme.colors.background }}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>⚔️ New Game</Text>

      {/* Color Selection */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Play as</Text>
        <OptionSelector
          options={colorOptions}
          selected={selectedColor}
          onSelect={(v) => setSelectedColor(v as any)}
        />
      </View>

      {/* Time Control */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Time Control</Text>
        <View style={styles.timeGrid}>
          {timeOptions.map((option) => {
            const active = timeControl === option.value;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.timeButton,
                  { 
                    backgroundColor: active ? theme.colors.primary + '15' : theme.colors.surfaceSecondary,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setTimeControl(option.value)}
              >
                <Text style={styles.timeIcon}>{option.icon}</Text>
                <Text style={[styles.timeValue, { color: active ? theme.colors.primary : theme.colors.text }]}>
                  {option.label}
                </Text>
                {option.unit && (
                  <Text style={[styles.timeUnit, { color: active ? theme.colors.primary : theme.colors.textSecondary }]}>
                    {option.unit}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Difficulty */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Difficulty</Text>
        
        <View style={[styles.difficultyBadge, { backgroundColor: difficultyInfo.color + '15' }]}>
          <Text style={styles.difficultyEmoji}>{difficultyInfo.emoji}</Text>
          <Text style={[styles.difficultyLabel, { color: difficultyInfo.color }]}>
            {difficultyInfo.label}
          </Text>
          <Text style={[styles.difficultyRating, { color: theme.colors.text }]}>
            {difficulty}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={800}
          maximumValue={2400}
          step={10}
          value={difficulty}
          onValueChange={(v) => setDifficulty(Math.round(v))}
          minimumTrackTintColor={difficultyInfo.color}
          maximumTrackTintColor={theme.colors.borderLight}
          thumbTintColor={difficultyInfo.color}
        />

        <View style={styles.range}>
          <Text style={[styles.rangeText, { color: theme.colors.textTertiary }]}>800</Text>
          <Text style={[styles.rangeText, { color: theme.colors.textTertiary }]}>2400</Text>
        </View>
      </View>

      {/* Actions */}
      <Button
        title="🎮 Start Game"
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
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.LG,
    letterSpacing: -0.5,
  },

  section: {
    borderRadius: RADIUS.XL,
    padding: SPACING.LG,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionLabel: {
    fontSize: FONT.SM,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.SM,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },

  timeButton: {
    width: '48%',
    paddingVertical: SPACING.LG,
    borderRadius: RADIUS.LG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  timeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  timeValue: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },

  timeUnit: {
    fontSize: FONT.XS,
    fontWeight: '600',
    marginTop: 2,
  },

  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: RADIUS.LG,
    marginBottom: SPACING.MD,
    gap: SPACING.SM,
  },

  difficultyEmoji: {
    fontSize: 24,
  },

  difficultyLabel: {
    fontSize: FONT.LG,
    fontWeight: '700',
  },

  difficultyRating: {
    fontSize: FONT.LG,
    fontWeight: '800',
  },

  slider: {
    height: 40,
    marginVertical: SPACING.XS,
  },

  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.XS,
  },

  rangeText: {
    fontSize: FONT.XS,
    fontWeight: '600',
  },

  playButton: {
    marginTop: SPACING.LG,
    marginBottom: SPACING.SM,
    borderRadius: RADIUS.XL,
    paddingVertical: SPACING.LG + 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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