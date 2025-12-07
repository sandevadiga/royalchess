import { View, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode, memo } from 'react';
import { useTheme } from '../../common/styles/themes/useTheme';
import { LAYOUT, RADIUS, SHADOW } from '../../constants';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

function Card({ children, style }: CardProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.XXL,
    padding: LAYOUT.CARD_PADDING,
    ...SHADOW.SMALL,
  },
});

export default memo(Card);
