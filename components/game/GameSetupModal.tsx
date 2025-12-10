import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View, Switch } from 'react-native';
import { useTheme } from '../../common/styles/themes/useTheme';
import { FONT, RADIUS, SPACING } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { updatePreferences } from '../../services/user/userSlice';
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
  undoEnabled: boolean;
}

function GameSetupModal({ visible, onClose, onStartGame }: GameSetupModalProps) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const computerDifficulty = user.computerDifficulty ?? 1200;
  const undoEnabled = user.preferences.undoEnabled;

  const [selectedColor, setSelectedColor] = useState<'white' | 'black' | 'random'>('white');
  const [difficulty, setDifficulty] = useState(1200);
  const [timeControl, setTimeControl] = useState('blitz');
  const [localUndoEnabled, setLocalUndoEnabled] = useState(undoEnabled);

  useEffect(() => {
    if (visible) {
      setDifficulty(computerDifficulty);
      setLocalUndoEnabled(undoEnabled);
    }
  }, [visible, computerDifficulty, undoEnabled]);

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

  const handleUndoToggle = useCallback((value: boolean) => {
    setLocalUndoEnabled(value);
    dispatch(updatePreferences({ undoEnabled: value }));
  }, [dispatch]);

  const handleStart = useCallback(() => {
    onStartGame({ color: selectedColor, difficulty, timeControl, undoEnabled: localUndoEnabled });
  }, [selectedColor, difficulty, timeControl, localUndoEnabled, onStartGame]);

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
                  {option.label}{option.unit && ` ${option.unit}`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Difficulty */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>

        <View style={[styles.difficultyBadge, { backgroundColor: difficultyInfo.color + '15' }]}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Difficulty</Text>
          <Text style={styles.difficultyEmoji}>{difficultyInfo.emoji}</Text>
          <Text style={[styles.difficultyLabel, { color: difficultyInfo.color }]}>
            {difficultyInfo.label}
          </Text>
          <Text style={[styles.difficultyRating, { color: theme.colors.text }]}>
            {difficulty}
          </Text>
        </View>

        <Pressable 
          style={styles.sliderWrapper}
          onPress={(e: GestureResponderEvent) => {
            const { locationX } = e.nativeEvent;
            const width = 300; // approximate width
            const percent = Math.max(0, Math.min(1, locationX / width));
            const newValue = Math.round(800 + percent * (2400 - 800));
            setDifficulty(newValue);
          }}
        >
          <View style={[styles.sliderTrack, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <View 
              style={[
                styles.sliderFill, 
                { 
                  width: `${((difficulty - 800) / (2400 - 800)) * 100}%`,
                  backgroundColor: difficultyInfo.color 
                }
              ]} 
            />
            <View 
              style={[
                styles.sliderThumb,
                {
                  left: `${((difficulty - 800) / (2400 - 800)) * 100}%`,
                  backgroundColor: difficultyInfo.color
                }
              ]}
            />
          </View>
        </Pressable>

        <View style={styles.range}>
          <Text style={[styles.rangeText, { color: theme.colors.textTertiary }]}>800</Text>
          <Text style={[styles.rangeText, { color: theme.colors.textTertiary }]}>2400</Text>
        </View>
      </View>

      {/* Undo Option */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.undoRow}>
          <View style={styles.undoInfo}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Undo Moves</Text>
            <Text style={[styles.undoDescription, { color: theme.colors.textTertiary }]}>Allow taking back moves</Text>
          </View>
          <Switch
            value={localUndoEnabled}
            onValueChange={handleUndoToggle}
            trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.primary + '40' }}
            thumbColor={localUndoEnabled ? theme.colors.primary : theme.colors.textTertiary}
          />
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
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.SM,
    letterSpacing: -0.5,
  },

  section: {
    borderRadius: RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  sectionLabel: {
    fontSize: FONT.XS,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.XS,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
  },

  timeButton: {
    width: '48%',
    height: 50,
    borderRadius: RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    gap: 4,
  },

  timeIcon: {
    fontSize: 16,
  },

  timeValue: {
    fontSize: FONT.XS,
    fontWeight: '700',
  },

  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: RADIUS.MD,
    marginBottom: SPACING.SM,
    gap: SPACING.XS,
  },

  difficultyEmoji: {
    fontSize: 18,
  },

  difficultyLabel: {
    fontSize: FONT.MD,
    fontWeight: '700',
  },

  difficultyRating: {
    fontSize: FONT.MD,
    fontWeight: '800',
  },

  sliderWrapper: {
    paddingVertical: SPACING.SM,
    marginBottom: SPACING.XS,
  },

  sliderTrack: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
  },

  sliderFill: {
    height: 8,
    borderRadius: 4,
  },

  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -6,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.XS,
    marginTop: -4,
  },

  rangeText: {
    fontSize: FONT.XS,
    fontWeight: '600',
  },

  playButton: {
    marginTop: SPACING.SM,
    marginBottom: SPACING.XS,
    borderRadius: RADIUS.LG,
    paddingVertical: SPACING.MD,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  playText: {
    fontSize: FONT.MD,
    fontWeight: '700',
    color: '#fff',
  },

  cancelButton: {
    paddingVertical: SPACING.SM,
  },

  undoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  undoInfo: {
    flex: 1,
  },

  undoDescription: {
    fontSize: FONT.XS,
    marginTop: 2,
  },
});

export default memo(GameSetupModal);