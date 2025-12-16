/**
 * ModernGameSetupModal - Refactored with Modern UI Standards
 */

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { updatePreferences } from '../../services/user/userSlice';
import ModernModal from '../ui/ModernModal';
import ModernButton from '../ui/ModernButton';
import Chip from '../ui/Chip';
import Surface from '../ui/Surface';
import Badge from '../ui/Badge';

interface ModernGameSetupModalProps {
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

function ModernGameSetupModal({ visible, onClose, onStartGame }: ModernGameSetupModalProps) {
  const { theme } = useModernTheme();
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

  const colorOptions = useMemo(
    () => [
      { value: 'white', label: 'White', emoji: '⚪' },
      { value: 'black', label: 'Black', emoji: '⚫' },
      { value: 'random', label: 'Random', emoji: '🎲' },
    ],
    []
  );

  const timeOptions = useMemo(
    () => [
      { value: 'blitz', label: 'Blitz', time: '5 min', emoji: '⚡' },
      { value: 'rapid', label: 'Rapid', time: '10 min', emoji: '⏱️' },
      { value: 'classical', label: 'Classical', time: '30 min', emoji: '♟️' },
      { value: 'timeless', label: 'Timeless', time: 'No limit', emoji: '∞' },
    ],
    []
  );

  const getDifficultyInfo = useCallback((rating: number) => {
    if (rating < 1000) return { label: 'Beginner', emoji: '🌱', variant: 'success' as const };
    if (rating < 1400) return { label: 'Intermediate', emoji: '📚', variant: 'info' as const };
    if (rating < 1800) return { label: 'Advanced', emoji: '⚡', variant: 'warning' as const };
    if (rating < 2200) return { label: 'Expert', emoji: '🔥', variant: 'error' as const };
    return { label: 'Master', emoji: '👑', variant: 'primary' as const };
  }, []);

  const difficultyInfo = useMemo(() => getDifficultyInfo(difficulty), [difficulty, getDifficultyInfo]);

  const handleUndoToggle = useCallback(
    (value: boolean) => {
      setLocalUndoEnabled(value);
      dispatch(updatePreferences({ undoEnabled: value }));
    },
    [dispatch]
  );

  const handleStart = useCallback(() => {
    onStartGame({ color: selectedColor, difficulty, timeControl, undoEnabled: localUndoEnabled });
  }, [selectedColor, difficulty, timeControl, localUndoEnabled, onStartGame]);

  return (
    <ModernModal visible={visible} onClose={onClose} glass={true} position="bottom">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing.lg }}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {
                  fontSize: theme.typography.fontSize.xxl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.textPrimary,
                },
              ]}
            >
              New Game
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.xs,
                },
              ]}
            >
              Choose your settings and start playing
            </Text>
          </View>

          <Surface elevation={0} variant="outlined" padding={theme.spacing.lg}>
            <Text
              style={[
                styles.sectionLabel,
                {
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.md,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                },
              ]}
            >
              Play As
            </Text>
            <View style={styles.chipRow}>
              {colorOptions.map(option => (
                <Chip
                  key={option.value}
                  selected={selectedColor === option.value}
                  onPress={() => setSelectedColor(option.value as any)}
                  leftIcon={<Text style={{ fontSize: 16 }}>{option.emoji}</Text>}
                >
                  {option.label}
                </Chip>
              ))}
            </View>
          </Surface>

          <Surface elevation={0} variant="outlined" padding={theme.spacing.lg}>
            <Text
              style={[
                styles.sectionLabel,
                {
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.md,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                },
              ]}
            >
              Time Control
            </Text>
            <View style={styles.timeGrid}>
              {timeOptions.map(option => (
                <Surface
                  key={option.value}
                  elevation={0}
                  variant={timeControl === option.value ? 'elevated' : 'outlined'}
                  padding={theme.spacing.md}
                  onPress={() => setTimeControl(option.value)}
                  style={[
                    styles.timeCard,
                    timeControl === option.value && {
                      backgroundColor: `${theme.colors.primary}15`,
                      borderColor: theme.colors.primary,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24, marginBottom: theme.spacing.xs }}>
                    {option.emoji}
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.textPrimary,
                      marginBottom: theme.spacing.xxs,
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {option.time}
                  </Text>
                </Surface>
              ))}
            </View>
          </Surface>

          <Surface elevation={0} variant="outlined" padding={theme.spacing.lg}>
            <View style={styles.difficultyHeader}>
              <Text
                style={[
                  styles.sectionLabel,
                  {
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  },
                ]}
              >
                Difficulty
              </Text>
              <Badge variant={difficultyInfo.variant} size="sm">
                {difficultyInfo.emoji} {difficultyInfo.label} {difficulty}
              </Badge>
            </View>

            <View style={{ marginTop: theme.spacing.md }}>
              <View
                style={[
                  styles.sliderTrack,
                  { backgroundColor: theme.colors.border, borderRadius: theme.radius.full },
                ]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${((difficulty - 800) / (2400 - 800)) * 100}%`,
                      backgroundColor: theme.colors.primary,
                      borderRadius: theme.radius.full,
                    },
                  ]}
                />
              </View>
              <View style={[styles.sliderLabels, { marginTop: theme.spacing.sm }]}>
                <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textTertiary }}>
                  800
                </Text>
                <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textTertiary }}>
                  2400
                </Text>
              </View>
            </View>
          </Surface>

          <Surface elevation={0} variant="outlined" padding={theme.spacing.lg}>
            <View style={styles.undoRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.textPrimary,
                    marginBottom: theme.spacing.xxs,
                  }}
                >
                  Undo Moves
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  Allow taking back moves during the game
                </Text>
              </View>
              <Switch
                value={localUndoEnabled}
                onValueChange={handleUndoToggle}
                trackColor={{
                  false: theme.colors.border,
                  true: `${theme.colors.primary}60`,
                }}
                thumbColor={localUndoEnabled ? theme.colors.primary : theme.colors.textTertiary}
              />
            </View>
          </Surface>

          <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
            <ModernButton onPress={handleStart} size="lg" fullWidth>
              Start Game
            </ModernButton>
            <ModernButton onPress={onClose} variant="ghost" size="lg" fullWidth>
              Cancel
            </ModernButton>
          </View>
        </View>
      </ScrollView>
    </ModernModal>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
  },
  title: {},
  subtitle: {},
  sectionLabel: {},
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderTrack: {
    height: 6,
    position: 'relative',
  },
  sliderFill: {
    height: 6,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  undoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

export default memo(ModernGameSetupModal);
