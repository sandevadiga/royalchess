import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';

interface MoveChipProps {
  moveNumber: number;
  san: string;
  color: 'w' | 'b';
  moveIndex: number;
  undoEnabled?: boolean;
  onPress?: (moveIndex: number) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const MoveChip = React.memo<MoveChipProps>(({ 
  moveNumber, 
  san, 
  color,
  moveIndex,
  undoEnabled = false,
  onPress,
  style,
  textStyle 
}) => {
  console.log('🔧 MoveChip Props:', {
    moveNumber,
    san,
    moveIndex,
    undoEnabled,
    hasOnPress: !!onPress
  });
  
  const backgroundColor = color === 'w' ? '#e8f4f8' : '#2c2c2c';
  const textColor = color === 'w' ? '#333' : '#fff';

  const handlePress = () => {
    console.log('👆 MoveChip Pressed:', { moveIndex, undoEnabled, hasOnPress: !!onPress });
    if (undoEnabled && onPress) {
      console.log('✅ Calling onPress with moveIndex:', moveIndex);
      onPress(moveIndex);
    } else {
      console.log('❌ Press blocked:', { undoEnabled, hasOnPress: !!onPress });
    }
  };

  const ChipContent = (
    <View style={[styles.chip, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {moveNumber}.{san}
      </Text>
    </View>
  );

  if (undoEnabled) {
    return (
      <Pressable 
        onPress={handlePress} 
        style={({ pressed }) => [
          styles.pressable,
          { opacity: pressed ? 0.7 : 1 }
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
      >
        {ChipContent}
      </Pressable>
    );
  }

  return ChipContent;
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
  pressable: {
    opacity: 1,
  },
});
