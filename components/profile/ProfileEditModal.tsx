import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

export interface ProfileData {
  name: string;
  favoriteColor: 'white' | 'black' | 'random';
  theme: 'light' | 'dark' | 'auto';
  boardColorScheme: 'classic' | 'blue' | 'green' | 'purple' | 'wood';
}

type FavoriteColor = ProfileData['favoriteColor'];
type ThemeType = ProfileData['theme'];
type BoardScheme = ProfileData['boardColorScheme'];

interface OptionChipProps<T extends string> {
  label: string;
  icon?: string;
  isActive: boolean;
  onPress: () => void;
}

const OptionChip = memo(function OptionChip<T extends string>({
  label,
  icon,
  isActive,
  onPress,
}: OptionChipProps<T>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chipBase, isActive && styles.chipActive]}
    >
      {icon ? <Text style={styles.chipIcon}>{icon}</Text> : null}
      <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

interface BoardStyleCardProps {
  label: string;
  colors: [string, string];
  isActive: boolean;
  onPress: () => void;
}

const BoardStyleCard = memo(function BoardStyleCard({
  label,
  colors,
  isActive,
  onPress,
}: BoardStyleCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.boardCard, isActive && styles.boardCardActive]}
    >
      <View style={styles.boardPreview}>
        <View style={[styles.boardSquare, { backgroundColor: colors[0] }]} />
        <View style={[styles.boardSquare, { backgroundColor: colors[1] }]} />
      </View>
      <Text style={[styles.boardLabel, isActive && styles.boardLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

function ProfileEditModal({
  visible,
  onClose,
  onSave,
  initialData,
}: ProfileEditModalProps) {
  const [name, setName] = useState(initialData.name);
  const [favoriteColor, setFavoriteColor] =
    useState<FavoriteColor>(initialData.favoriteColor);
  const [theme, setTheme] = useState<ThemeType>(initialData.theme);
  const [boardColorScheme, setBoardColorScheme] =
    useState<BoardScheme>(initialData.boardColorScheme);

  useEffect(() => {
    setName(initialData.name);
    setFavoriteColor(initialData.favoriteColor);
    setTheme(initialData.theme);
    setBoardColorScheme(initialData.boardColorScheme);
  }, [initialData]);

  const colorOptions = useMemo(
    () => [
      { value: 'white' as const, label: 'White', icon: '⚪' },
      { value: 'black' as const, label: 'Black', icon: '⚫' },
      { value: 'random' as const, label: 'Random', icon: '🎲' },
    ],
    [],
  );

  const themeOptions = useMemo(
    () => [
      { value: 'light' as const, label: 'Light', icon: '☀️' },
      { value: 'dark' as const, label: 'Dark', icon: '🌙' },
      { value: 'auto' as const, label: 'Auto', icon: '🔄' },
    ],
    [],
  );

  const boardColorOptions = useMemo(
    () => [
      {
        value: 'classic' as const,
        label: 'Classic',
        colors: ['#f0d9b5', '#b58863'] as [string, string],
      },
      {
        value: 'blue' as const,
        label: 'Blue',
        colors: ['#dee3e6', '#8ca2ad'] as [string, string],
      },
      {
        value: 'green' as const,
        label: 'Green',
        colors: ['#ffffdd', '#86a666'] as [string, string],
      },
      {
        value: 'purple' as const,
        label: 'Purple',
        colors: ['#e8d5f0', '#9f7ab8'] as [string, string],
      },
      {
        value: 'wood' as const,
        label: 'Wood',
        colors: ['#f4e4c1', '#a67c52'] as [string, string],
      },
    ],
    [],
  );

  const handleSave = useCallback(() => {
    onSave({
      name: name.trim(),
      favoriteColor,
      theme,
      boardColorScheme,
    });
  }, [name, favoriteColor, theme, boardColorScheme, onSave]);

  const handleReset = useCallback(() => {
    setName(initialData.name);
    setFavoriteColor(initialData.favoriteColor);
    setTheme(initialData.theme);
    setBoardColorScheme(initialData.boardColorScheme);
  }, [initialData]);

  const isSaveDisabled = !name.trim();

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Edit Profile</Text>
          <Text style={styles.subtitle}>
            Personalize how your profile and board look during games.
          </Text>
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.label}>👤 Name</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              maxLength={30}
            />
            <Text style={styles.helperText}>
              This will be visible on leaderboards and matches.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>♟️ Favorite Color</Text>
              <Text style={styles.sectionHint}>Choose your default side</Text>
            </View>
            <View style={styles.row}>
              {colorOptions.map(option => (
                <OptionChip
                  key={option.value}
                  label={option.label}
                  icon={option.icon}
                  isActive={favoriteColor === option.value}
                  onPress={() => setFavoriteColor(option.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>🎨 Theme</Text>
              <Text style={styles.sectionHint}>Match app with your device</Text>
            </View>
            <View style={styles.row}>
              {themeOptions.map(option => (
                <OptionChip
                  key={option.value}
                  label={option.label}
                  icon={option.icon}
                  isActive={theme === option.value}
                  onPress={() => setTheme(option.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>🎯 Board Colors</Text>
              <Text style={styles.sectionHint}>Preview how your board looks</Text>
            </View>
            <View style={styles.boardGrid}>
              {boardColorOptions.map(option => (
                <BoardStyleCard
                  key={option.value}
                  label={option.label}
                  colors={option.colors}
                  isActive={boardColorScheme === option.value}
                  onPress={() => setBoardColorScheme(option.value)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleReset} style={styles.resetArea}>
            <Text style={styles.resetText}>Reset to current</Text>
          </TouchableOpacity>

          <View style={styles.buttonsRow}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.button}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              style={styles.button}
              disabled={isSaveDisabled}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: '90%',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    color: '#6B7280',
  },
  scrollContent: {
    paddingBottom: 12,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  helperText: {
    marginTop: 6,
    fontSize: 11,
    color: '#9CA3AF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  chipBase: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  chipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  chipIcon: {
    fontSize: 22,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipLabelActive: {
    color: '#111827',
  },
  boardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  boardCard: {
    width: '30%',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  boardCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  boardPreview: {
    flexDirection: 'row',
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  boardSquare: {
    flex: 1,
  },
  boardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  boardLabelActive: {
    color: '#111827',
  },
  footer: {
    marginTop: 8,
  },
  resetArea: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  resetText: {
    fontSize: 11,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
  },
});

export default memo(ProfileEditModal);
