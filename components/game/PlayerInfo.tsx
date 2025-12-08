import { memo, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../common/styles/themes/useTheme';
import Avatar from '../ui/Avatar';

interface PlayerInfoProps {
  name: string;
  rating: number;
  timeRemaining?: number;
  moveTime?: number;
  isActive?: boolean;
  isOpponent?: boolean;
  capturedPieces?: string;
  style?: ViewStyle;
}

function PlayerInfo({
  name,
  rating,
  timeRemaining,
  moveTime,
  isActive = false,
  isOpponent = false,
  capturedPieces,
  style
}: PlayerInfoProps) {
  const { theme } = useTheme();

  const formattedTime = useMemo(() => {
    if (timeRemaining === undefined) return null;
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }, [timeRemaining]);

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.surface,
        borderColor: isActive ? theme.colors.primary : theme.colors.border || '#E0E0E0',
      },
      isActive && styles.activeContainer,
      style
    ]}>
      <Avatar name={name} size={32} isActive={isActive} />
      
      <View style={styles.infoSection}>
        <View style={styles.topRow}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {name}
          </Text>
          <View style={[styles.ratingBadge, { backgroundColor: theme.colors.primary + '15' }]}>
            <Text style={[styles.ratingText, { color: theme.colors.primary }]}>{rating}</Text>
          </View>
        </View>
        
        <View style={styles.bottomRow}>
          {formattedTime && (
            <Text style={[styles.time, { color: isActive ? theme.colors.primary : theme.colors.text }]}>
              {formattedTime}
            </Text>
          )}
          {moveTime !== undefined && isActive && (
            <Text style={[styles.moveTime, { color: theme.colors.textSecondary }]}> • +{moveTime}s</Text>
          )}
          {capturedPieces && (
            <Text style={[styles.captured, { color: theme.colors.textSecondary }]}> {capturedPieces}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 3,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  activeContainer: {
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  infoSection: {
    flex: 1,
    marginLeft: 10,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.1,
    flex: 1,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  moveTime: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.65,
  },
  captured: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 'auto',
  },
});

export default memo(PlayerInfo);
