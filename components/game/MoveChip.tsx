import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface MoveChipProps {
  moveNumber: number;
  san: string;
  color: 'w' | 'b';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const MoveChip = React.memo<MoveChipProps>(({ 
  moveNumber, 
  san, 
  color,
  style,
  textStyle 
}) => {
  const backgroundColor = color === 'w' ? '#e8f4f8' : '#2c2c2c';
  const textColor = color === 'w' ? '#333' : '#fff';

  return (
    <View style={[styles.chip, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {moveNumber}.{san}
      </Text>
    </View>
  );
});

MoveChip.displayName = 'MoveChip';

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
