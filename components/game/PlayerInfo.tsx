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
  style?: ViewStyle;
}

function PlayerInfo({
  name,
  rating,
  timeRemaining,
  moveTime,
  isActive = false,
  isOpponent = false,
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
      isOpponent ? styles.opponent : styles.player,
      style
    ]}>
      <Avatar name={name} size={34} isActive={isActive} />
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.colors.textSecondary }]} numberOfLines={1}>{name}</Text>
          <View style={[styles.ratingTag, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
        <View style={styles.timeRow}>
          {formattedTime && (
            <Text style={[styles.time, { color: theme.colors.primary }]}>{formattedTime}</Text>
          )}
          {moveTime !== undefined && isActive && (
            <Text style={[styles.moveTime, { color: theme.colors.textSecondary }]}> • {moveTime}s</Text>
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
    height: 50,
    paddingHorizontal: 8,
    backgroundColor: '#e88484ff',
    borderRadius: 6,
    marginVertical: 4,
  },
  opponent: {
    justifyContent: 'flex-start',
  },
  player: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  details: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },
  ratingTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  moveTime: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default memo(PlayerInfo);
