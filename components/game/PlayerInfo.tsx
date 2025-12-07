import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { memo, useMemo } from 'react';
import Avatar from '../ui/Avatar';
import { useTheme } from '../../common/styles/themes/useTheme';
import { SPACING, FONT, LAYOUT } from '../../constants';

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
      <Avatar name={name} size={LAYOUT.AVATAR_SIZE_DEFAULT} isActive={isActive} />
      <View style={styles.details}>
        <Text style={[styles.name, { color: theme.colors.textSecondary }]}>{name}</Text>
        <Text style={[styles.rating, { color: theme.colors.primary }]}>{rating}</Text>
        {formattedTime && (
          <Text style={[styles.time, { color: theme.colors.primary }]}>{formattedTime}</Text>
        )}
        {moveTime !== undefined && (
          <Text style={[styles.moveTime, { color: theme.colors.warning }]}>Move: {moveTime}s</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  opponent: {
    justifyContent: 'flex-start',
  },
  player: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  details: {
    marginHorizontal: SPACING.SM,
  },
  name: {
    fontSize: FONT.MD,
    marginBottom: 5,
  },
  rating: {
    fontSize: FONT.XL,
    fontWeight: 'bold',
  },
  time: {
    fontSize: FONT.BASE,
    fontWeight: 'bold',
    marginTop: 5,
  },
  moveTime: {
    fontSize: FONT.MD,
    fontWeight: '600',
    marginTop: 5,
  },
});

export default memo(PlayerInfo);
