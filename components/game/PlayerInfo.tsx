import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { memo, useMemo } from 'react';
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
      <Avatar name={name} size={40} isActive={isActive} />
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rating}>{rating}</Text>
        {formattedTime && (
          <Text style={styles.time}>{formattedTime}</Text>
        )}
        {moveTime !== undefined && (
          <Text style={styles.moveTime}>Move: {moveTime}s</Text>
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
    marginHorizontal: 8,
  },
  name: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rating: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  moveTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginTop: 5,
  },
});

export default memo(PlayerInfo);
